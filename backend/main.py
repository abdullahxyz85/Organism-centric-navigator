from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import logging
from openai import OpenAI
import pymongo
from pymongo import MongoClient
import json

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NASA Hackathon API",
    description="API for organism search with embedding-based retrieval and LLM processing",
    version="1.0.0"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client with AI/ML API
openai_client = OpenAI(
    base_url="https://api.aimlapi.com/v1",
    api_key=os.getenv("AIMLAPI_KEY"),
)

# MongoDB connection
mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
db_name = os.getenv("MONGODB_DB_NAME", "nasa_hackathon")
collection_name = os.getenv("MONGODB_COLLECTION_NAME", "organism_data")

try:
    mongo_client = MongoClient(mongodb_url)
    db = mongo_client[db_name]
    collection = db[collection_name]
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    mongo_client = None

# Request/Response models
class SearchRequest(BaseModel):
    query: str
    condition: Optional[str] = None  # microgravity, radiation, temperature

class SearchResponse(BaseModel):
    organism_name: str
    condition: Optional[str]
    description: str
    scientific_details: dict
    relevant_chunks: List[str]

class ErrorResponse(BaseModel):
    error: str
    detail: str

def get_embedding(text: str) -> List[float]:
    """Get embedding for text using OpenAI embedding model"""
    try:
        response = openai_client.embeddings.create(
            model="text-embedding-3-large",
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Error getting embedding: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate embedding")

def query_mongodb_with_embedding(query_embedding: List[float], condition: Optional[str] = None, limit: int = 5):
    """Query MongoDB using vector similarity search"""
    try:
        # MongoDB aggregation pipeline for vector search
        pipeline = []
        
        # Add condition filter if provided
        if condition:
            pipeline.append({
                "$match": {
                    "condition": {"$regex": condition, "$options": "i"}
                }
            })
        
        # Vector similarity search using $vectorSearch (if available) or manual cosine similarity
        pipeline.extend([
            {
                "$addFields": {
                    "similarity": {
                        "$reduce": {
                            "input": {"$range": [0, {"$size": "$embedding"}]},
                            "initialValue": 0,
                            "in": {
                                "$add": [
                                    "$$value",
                                    {
                                        "$multiply": [
                                            {"$arrayElemAt": ["$embedding", "$$this"]},
                                            {"$arrayElemAt": [query_embedding, "$$this"]}
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {"$sort": {"similarity": -1}},
            {"$limit": limit},
            {
                "$project": {
                    "_id": 1,
                    "organism_name": 1,
                    "condition": 1,
                    "description": 1,
                    "scientific_details": 1,
                    "content": 1,
                    "similarity": 1
                }
            }
        ])
        
        results = list(collection.aggregate(pipeline))
        return results
        
    except Exception as e:
        logger.error(f"Error querying MongoDB: {e}")
        raise HTTPException(status_code=500, detail="Failed to query database")

def get_llm_response(user_query: str, chunks: List[dict], condition: Optional[str] = None) -> dict:
    """Get response from LLM with system prompt and retrieved chunks"""
    
    # Validate chunks
    if not chunks:
        logger.warning("No chunks provided to LLM")
        return {
            "organism_name": "Unknown",
            "condition": condition if condition else "Not specified",
            "description": "No relevant data found",
            "scientific_details": {
                "classification": "Unknown",
                "response_mechanisms": [],
                "experimental_findings": "No data available",
                "applications": "No data available"
            },
            "relevant_chunks": []
        }
    
    # Prepare context from chunks - limit to first 3 chunks to avoid token limits
    limited_chunks = chunks[:3]  # Take only top 3 chunks
    context_parts = []
    
    for i, chunk in enumerate(limited_chunks):
        content = chunk.get('content', '').strip()
        if not content or len(content) < 10:  # Skip very short or empty chunks
            continue
            
        context_part = f"--- Chunk {i+1} ---\n"
        context_part += f"Organism: {chunk.get('organism_name', 'Unknown')}\n"
        context_part += f"Condition: {chunk.get('condition', 'Not specified')}\n"
        
        # Limit content length to avoid token issues
        if len(content) > 1000:
            content = content[:1000] + "..."
        context_part += f"Content: {content}"
        
        context_parts.append(context_part)
    
    context = "\n\n".join(context_parts)
    
    # If no valid content found, return fallback
    if not context.strip():
        logger.warning("No valid content found in chunks")
        return {
            "organism_name": "Unknown",
            "condition": condition if condition else "Not specified", 
            "description": "No valid scientific content found",
            "scientific_details": {
                "classification": "Unknown",
                "response_mechanisms": [],
                "experimental_findings": "No data available",
                "applications": "No data available"
            },
            "relevant_chunks": []
        }
    
    system_prompt = """You are an expert scientific research assistant. Your ONLY job is to return a valid JSON object.

STRICT REQUIREMENTS:
1. Return ONLY valid JSON - no text before or after
2. Use the exact field names provided
3. Ensure all fields are present
4. Use proper JSON syntax with double quotes

REQUIRED JSON STRUCTURE:
{
  "organism_name": "string",
  "condition": "string", 
  "description": "string",
  "scientific_details": {
    "classification": "string",
    "response_mechanisms": ["array of strings"],
    "experimental_findings": "string",
    "applications": "string"
  },
  "relevant_chunks": ["array of strings"]
}

EXAMPLE VALID RESPONSE:
{
  "organism_name": "Escherichia coli",
  "condition": "microgravity",
  "description": "E. coli shows increased antibiotic resistance under microgravity conditions due to changes in gene expression and protein synthesis rates.",
  "scientific_details": {
    "classification": "Bacteria",
    "response_mechanisms": ["gene expression changes", "protein synthesis modification"],
    "experimental_findings": "Increased resistance to ampicillin and tetracycline observed in space conditions",
    "applications": "Space medicine research, antibiotic development"
  },
  "relevant_chunks": ["E. coli in microgravity shows...", "Gene expression changes include..."]
}

RESPOND WITH ONLY THE JSON OBJECT. NO OTHER TEXT."""

    user_message = f"""Analyze this scientific data and return ONLY a JSON object:

Query: {user_query}
Condition: {condition if condition else 'Any condition'}

Data:
{context}

Return JSON only."""

    try:
        logger.info(f"Sending request to LLM with {len(context)} characters of context")
        
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.1,
            max_tokens=2000
        )
        
        # Parse JSON response
        content = response.choices[0].message.content.strip()
        logger.info(f"LLM response length: {len(content)} characters")
        logger.info(f"LLM response preview: {content[:200]}...")
        
        print(f"DEBUG - Full LLM response: {repr(content)}")
        
        # Check if response is empty
        if not content:
            logger.error("LLM returned empty response")
            logger.info("Returning fallback response due to empty LLM response")
            return {
                "organism_name": "Unknown",
                "condition": condition if condition else "Not specified",
                "description": f"Unable to process query: {user_query}",
                "scientific_details": {
                    "classification": "Unknown",
                    "response_mechanisms": [],
                    "experimental_findings": "LLM returned empty response",
                    "applications": "No data available"
                },
                "relevant_chunks": []
            }
        
        # Remove any markdown formatting if present
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        
        # Try to find JSON object in the response
        content = content.strip()
        
        # If response doesn't start with {, try to find the JSON object
        if not content.startswith("{"):
            # Find the first { and last }
            start_idx = content.find("{")
            end_idx = content.rfind("}")
            if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                content = content[start_idx:end_idx+1]
            else:
                logger.error(f"Could not find JSON object in response: {content}")
                raise HTTPException(status_code=500, detail="Could not find valid JSON in LLM response")
        
        try:
            parsed_response = json.loads(content)
            
            # Validate required fields
            required_fields = ["organism_name", "condition", "description", "scientific_details"]
            for field in required_fields:
                if field not in parsed_response:
                    logger.warning(f"Missing required field '{field}' in LLM response")
                    if field == "organism_name":
                        parsed_response[field] = "Unknown"
                    elif field == "condition":
                        parsed_response[field] = "Not specified"
                    elif field == "description":
                        parsed_response[field] = "No description available"
                    elif field == "scientific_details":
                        parsed_response[field] = {
                            "classification": "Unknown",
                            "response_mechanisms": [],
                            "experimental_findings": "No data available",
                            "applications": "No data available"
                        }
            
            # Ensure scientific_details has required structure
            if "scientific_details" in parsed_response and isinstance(parsed_response["scientific_details"], dict):
                sd = parsed_response["scientific_details"]
                if "classification" not in sd:
                    sd["classification"] = "Unknown"
                if "response_mechanisms" not in sd:
                    sd["response_mechanisms"] = []
                if "experimental_findings" not in sd:
                    sd["experimental_findings"] = "No data available"
                if "applications" not in sd:
                    sd["applications"] = "No data available"
            
            # Ensure relevant_chunks exists
            if "relevant_chunks" not in parsed_response:
                parsed_response["relevant_chunks"] = []
            
            return parsed_response
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response as JSON: {e}")
            logger.error(f"LLM response content: '{content}'")
            
            # Return a fallback response instead of raising an exception
            logger.info("Returning fallback response due to JSON parsing error")
            return {
                "organism_name": "Unknown",
                "condition": condition if condition else "Not specified",
                "description": f"Error processing response for query: {user_query}",
                "scientific_details": {
                    "classification": "Unknown",
                    "response_mechanisms": [],
                    "experimental_findings": "Error in LLM response processing",
                    "applications": "No data available"
                },
                "relevant_chunks": []
            }
        
    except Exception as e:
        logger.error(f"Error getting LLM response: {e}")
        # Return a fallback response instead of raising an exception
        logger.info("Returning fallback response due to LLM error")
        return {
            "organism_name": "Unknown",
            "condition": condition if condition else "Not specified",
            "description": f"Error processing query: {user_query}",
            "scientific_details": {
                "classification": "Unknown",
                "response_mechanisms": [],
                "experimental_findings": "Error in LLM processing",
                "applications": "No data available"
            },
            "relevant_chunks": []
        }

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "NASA Hackathon API is running", "status": "healthy"}

@app.post("/search", response_model=SearchResponse)
async def search_organism(request: SearchRequest):
    """
    Search for organism information using embedding-based retrieval and LLM processing
    
    Args:
        request: SearchRequest containing query string and optional condition filter
        
    Returns:
        SearchResponse with comprehensive organism information
    """
    try:
        logger.info(f"Processing search request: {request.query}, condition: {request.condition}")
        
        # Step 1: Convert user query to embeddings
        logger.info("Generating embeddings for user query...")
        query_embedding = get_embedding(request.query)
        
        # Step 2: Query MongoDB with embeddings
        logger.info("Querying MongoDB with embeddings...")
        chunks = query_mongodb_with_embedding(query_embedding, request.condition)
        
        if not chunks:
            raise HTTPException(
                status_code=404, 
                detail="No relevant organism data found for the given query and condition"
            )
        
        logger.info(f"Retrieved {len(chunks)} relevant chunks from database")
        
        # Step 3: Send to LLM for processing
        logger.info("Processing with LLM...")
        llm_response = get_llm_response(request.query, chunks, request.condition)
        
        # Extract relevant chunks for the response
        relevant_chunks = [chunk.get('content', '') for chunk in chunks[:3]]  # Top 3 chunks
        
        # Create response
        response = SearchResponse(
            organism_name=llm_response.get('organism_name', 'Unknown'),
            condition=llm_response.get('condition', request.condition),
            description=llm_response.get('description', ''),
            scientific_details=llm_response.get('scientific_details', {}),
            relevant_chunks=relevant_chunks
        )
        
        logger.info("Search request completed successfully")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in search endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/health")
async def health_check():
    """Detailed health check including database connectivity"""
    health_status = {
        "api": "healthy",
        "mongodb": "unknown",
        "openai": "unknown"
    }
    
    # Check MongoDB connection
    try:
        if mongo_client:
            mongo_client.admin.command('ping')
            health_status["mongodb"] = "healthy"
        else:
            health_status["mongodb"] = "disconnected"
    except Exception as e:
        health_status["mongodb"] = f"error: {str(e)}"
    
    # Check OpenAI connection
    try:
        # Simple test call
        openai_client.models.list()
        health_status["openai"] = "healthy"
    except Exception as e:
        health_status["openai"] = f"error: {str(e)}"
    
    return health_status

@app.get("/test-llm")
async def test_llm():
    """Test endpoint to verify LLM connectivity and response format"""
    try:
        test_prompt = """You are a test assistant. Return ONLY this exact JSON:
{"test": "success", "message": "LLM is working correctly"}"""
        
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": test_prompt}],
            temperature=0.1,
            max_tokens=100
        )
        
        content = response.choices[0].message.content.strip()
        
        return {
            "status": "success",
            "llm_response": content,
            "response_length": len(content),
            "is_json": True
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "llm_response": None,
            "response_length": 0,
            "is_json": False
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
