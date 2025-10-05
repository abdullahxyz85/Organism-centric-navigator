# NASA Hackathon API

A FastAPI server that provides organism search functionality with embedding-based retrieval and LLM processing.

## Features

- **Embedding-based Search**: Uses OpenAI's text-embedding-3-large model to convert user queries into embeddings
- **MongoDB Vector Search**: Retrieves relevant organism data using vector similarity search
- **LLM Processing**: Uses GPT-5 model via AI/ML API to generate comprehensive JSON responses
- **Condition Filtering**: Supports filtering by conditions like microgravity, radiation, temperature

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy `env_example.txt` to `.env` and fill in your actual values:

```bash
# On Windows
copy env_example.txt .env

# On Linux/Mac
cp env_example.txt .env
```

Then edit `.env` with your actual values:

```env
# OpenAI AI/ML API Configuration
AIMLAPI_KEY=your_actual_aimlapi_key_here

# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=nasa_hackathon
MONGODB_COLLECTION_NAME=organism_data
```

### 3. MongoDB Setup

Ensure your MongoDB collection has documents with the following structure:

```json
{
  "_id": "ObjectId",
  "organism_name": "Escherichia coli",
  "condition": "microgravity",
  "description": "Bacterial response to space conditions",
  "scientific_details": {
    "classification": "Bacteria",
    "response_mechanisms": ["gene_expression_changes", "protein_synthesis"],
    "experimental_findings": "Increased antibiotic resistance",
    "applications": "Space medicine research"
  },
  "content": "Detailed research content about the organism...",
  "embedding": [0.1, 0.2, ...]  // Vector embedding of the content
}
```

### 4. Run the Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /search

Search for organism information using embedding-based retrieval and LLM processing.

**Request Body:**
```json
{
  "query": "E. coli bacteria in space",
  "condition": "microgravity"
}
```

**Response:**
```json
{
  "organism_name": "Escherichia coli",
  "condition": "microgravity",
  "description": "E. coli shows significant changes in gene expression under microgravity conditions...",
  "scientific_details": {
    "classification": "Bacteria",
    "response_mechanisms": ["gene_expression_changes", "protein_synthesis"],
    "experimental_findings": "Increased antibiotic resistance observed",
    "applications": "Space medicine research, antibiotic development"
  },
  "relevant_chunks": [
    "E. coli in microgravity shows...",
    "Gene expression changes include...",
    "Protein synthesis rates..."
  ]
}
```

### GET /

Health check endpoint.

**Response:**
```json
{
  "message": "NASA Hackathon API is running",
  "status": "healthy"
}
```

### GET /health

Detailed health check including database and API connectivity.

## Frontend Integration

### cURL Examples

#### Basic Search
```bash
curl -X POST "http://localhost:8000/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "E. coli bacteria response to space conditions",
    "condition": "microgravity"
  }'
```

#### Search without Condition Filter
```bash
curl -X POST "http://localhost:8000/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "radiation effects on bacteria"
  }'
```

#### JavaScript/Fetch Example
```javascript
const searchOrganism = async (query, condition = null) => {
  try {
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        condition: condition
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching organism:', error);
    throw error;
  }
};

// Usage examples
searchOrganism('E. coli in space', 'microgravity')
  .then(result => console.log(result))
  .catch(error => console.error(error));

searchOrganism('bacterial radiation resistance')
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

#### React Hook Example
```javascript
import { useState, useCallback } from 'react';

const useOrganismSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const search = useCallback(async (query, condition = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, condition }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { search, loading, error, result };
};

export default useOrganismSearch;
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `404`: No relevant organism data found
- `500`: Internal server error (embedding generation, database query, or LLM processing failed)

Error responses include detailed error messages:

```json
{
  "error": "Not Found",
  "detail": "No relevant organism data found for the given query and condition"
}
```

## Development

### Running in Development Mode

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### API Documentation

Once the server is running, visit:
- Interactive API docs: `http://localhost:8000/docs`
- ReDoc documentation: `http://localhost:8000/redoc`

## Notes

- The API uses CORS middleware to allow frontend integration
- All responses are in JSON format
- The LLM is configured to return only JSON responses without additional formatting
- Vector similarity search is performed using cosine similarity
- The system prompt is optimized for scientific organism research analysis
