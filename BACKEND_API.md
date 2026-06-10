# Veecos Backend - Serverless API

Production-ready AWS SAM application for Veecos Pvt Ltd commercial kitchen equipment management platform.

## 🏗️ Architecture Overview

- **Frontend:** Next.js (Public) + React SPA (Admin)
- **Backend:** AWS Lambda + API Gateway HTTP API
- **Database:** Amazon DynamoDB (Single-Table Design with GSI1 & GSI2)
- **Notifications:** AWS SES
- **Infrastructure as Code:** AWS SAM (Serverless Application Model)

## 📋 Project Structure

```
veecos-backend/
├── template.yaml                    # SAM infrastructure definition
├── samconfig.toml                  # SAM deployment configuration
├── requirements.txt                # Python dependencies
├── src/
│   ├── handlers/                   # Lambda function handlers
│   │   ├── categories.py          # Public category browsing
│   │   ├── products.py            # Public product catalog
│   │   ├── leads.py               # Lead submission + SES email
│   │   ├── admin_categories.py    # Admin category CRUD
│   │   ├── admin_products.py      # Admin product CRUD
│   │   └── admin_leads.py         # Admin lead management
│   └── lib/                        # Shared utilities
│       ├── dynamodb_service.py    # Database operations (all 6 access patterns)
│       ├── response_formatter.py  # Standardized HTTP responses
│       ├── validators.py          # Input validation
│       └── auth.py                # JWT/Cognito authentication
└── README.md                       # This file
```

## 🗄️ DynamoDB Single-Table Design

### Main Table: `Veecos-Main-<env>`

**Partition Key (PK):** `<ENTITY_TYPE>#<id>`  
**Sort Key (SK):** `<ENTITY_TYPE>#<id>`

### Global Secondary Indexes

**GSI1 - Category/Product Hierarchy**
- PK: `GSI1PK` | SK: `GSI1SK`
- Used for: Category trees, product-by-category listings

**GSI2 - Admin Lead Management**
- PK: `GSI2PK` | SK: `GSI2SK` (composite: `STATUS#<status>#DATE#<timestamp>`)
- Used for: Lead queries sorted by status and date

### Entity Types

| Entity | PK Format | SK Format | GSI1PK | GSI1SK | GSI2PK | GSI2SK |
|--------|-----------|-----------|--------|--------|--------|--------|
| **Category** | `CATEGORY#<id>` | `CATEGORY#<id>` | `CATEGORY#<parent_id>` | `CATEGORY#<id>` | - | - |
| **Product** | `PRODUCT#<id>` | `PRODUCT#<id>` | `CATEGORY#<cat_id>` | `PRODUCT#<timestamp>` | - | - |
| **Lead** | `LEAD#<id>` | `LEAD#<id>` | - | - | `LEAD#ALL` | `STATUS#<status>#DATE#<timestamp>` |

## 🔑 Access Patterns Implemented

### Public (Unauthenticated)

1. **GET /categories** - Fetch top-level root categories
2. **GET /categories/{id}/subcategories** - Fetch child categories
3. **GET /categories/{id}/products** - Fetch paginated products in category
4. **GET /products/{id}** - Fetch full product details with specs
5. **POST /leads** - Submit customer inquiry (triggers SES email)

### Admin (Protected by JWT/Cognito)

6. **POST /admin/categories** - Create category
7. **PUT /admin/categories/{id}** - Update category
8. **DELETE /admin/categories/{id}** - Delete category
9. **POST /admin/products** - Create product
10. **PUT /admin/products/{id}** - Update product
11. **DELETE /admin/products/{id}** - Delete product
12. **POST /admin/uploads/images** - Create a pre-signed S3 upload form
13. **GET /admin/leads** - Query all leads (with optional status filter)
14. **PATCH /admin/leads/{id}/status** - Update lead status

## 🚀 Getting Started

### Prerequisites

- AWS CLI configured with credentials
- AWS SAM CLI (`sam --version` should output version)
- Python 3.11+
- Node.js 18+ (for testing frontend integration)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/veecos/veecos-backend.git
cd veecos-backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Local Development

1. **Start SAM Local API:**
```bash
sam local start-api --port 3001 --parameter-overrides Environment=dev
```

The API will be available at `http://localhost:3001`

2. **Test an endpoint:**
```bash
curl -X GET http://localhost:3001/categories
```

3. **View function logs:**
```bash
sam local logs
```

## 📦 Deployment

### Build the Project

```bash
sam build
```

### Deploy to Dev

```bash
sam deploy --config-env dev
```

### Deploy to Staging

```bash
sam deploy --config-env staging
```

### Deploy to Production

```bash
sam deploy --config-env prod
```

## 📝 API Documentation

### Public Endpoints

#### GET /categories
Fetch all top-level root categories.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "PK": "CATEGORY#abc123",
        "SK": "CATEGORY#abc123",
        "Name": "Commercial Freezers",
        "Slug": "commercial-freezers",
        "Type": "Category"
      }
    ],
    "count": 5
  }
}
```

#### POST /leads
Submit a customer inquiry.

**Request:**
```json
{
  "LeadType": "PRODUCT_SPECIFIC",
  "ProductId": "prod456",
  "ContactData": {
    "Name": "John Doe",
    "Email": "john@example.com",
    "Phone": "+91-9876543210",
    "CompanyName": "ABC Kitchen Equipment",
    "Message": "Interested in 4-door blast freezer pricing"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "leadId": "lead789",
    "status": "NEW",
    "createdAt": "2026-06-06T15:00:00Z"
  }
}
```

### Admin Endpoints (Protected)

#### POST /admin/categories
Create a new category.

**Request:**
```json
{
  "Name": "Blast Freezers",
  "Slug": "blast-freezers",
  "ParentId": "cat123"
}
```

**Response:** `201 Created` with full category object.

#### POST /admin/products
Create a new product.

**Request:**
```json
{
  "Name": "4-Door SS Blast Freezer",
  "Slug": "4-door-ss-blast-freezer",
  "CategoryId": "cat123",
  "Images": [
    "https://s3.amazonaws.com/veecos/product1.jpg"
  ],
  "IsAvailable": true,
  "IsCustomizable": true,
  "Specs": {
    "Capacity": "1000L",
    "Power": "3Phase",
    "Material": "304 SS"
  }
}
```

#### POST /admin/uploads/images
Upload a product image to S3 and receive a public URL. Save the returned `imageUrl` in the product `Images` list.

**Request:**
```json
{
  "filename": "blast-freezer-front.jpg",
  "contentType": "image/jpeg",
  "imageBase64": "/9j/4AAQSkZJRgABAQ..."
}
```

**Response data:**
```json
{
  "key": "products/2026/06/uuid-blast-freezer-front.jpg",
  "imageUrl": "https://bucket.s3.region.amazonaws.com/products/2026/06/uuid-blast-freezer-front.jpg",
  "publicUrl": "https://bucket.s3.region.amazonaws.com/products/2026/06/uuid-blast-freezer-front.jpg",
  "size": 245760,
  "contentType": "image/jpeg"
}
```

If `imageBase64` is omitted, the endpoint returns a pre-signed S3 POST form for direct browser upload.

#### GET /admin/leads
Fetch all leads with optional filtering.

**Query Parameters:**
- `status` (optional): NEW, IN_PROGRESS, CONTACTED, CONVERTED, REJECTED
- `limit` (optional): 1-1000, default 100
- `lastKey` (optional): Base64-encoded pagination token

**Response:**
```json
{
  "success": true,
  "data": {
    "leads": [...],
    "count": 25,
    "hasMore": true,
    "lastKey": "..."
  }
}
```

#### PATCH /admin/leads/{id}/status
Update lead status.

**Request:**
```json
{
  "Status": "CONTACTED"
}
```

## 🔐 Authentication

### Development
Authentication is disabled in `dev` environment. Set `AUTH_REQUIRED=false` in Lambda environment variables.

### Production
For production, configure JWT validation with AWS Cognito or AWS Identity Center:
#### POST /login
Login to the admin panel which will give the JWT token and other details

**Request:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
      "tokenType": "Bearer",
      "accessToken": "...",
      "expiresAt": 1234567890,
      "user": {
        "username": "admin",
        "email": "...",
        "name": "...",
        "businessname": "..."
      }
    },
    "message": "Login successful"
}
```

## 📧 Email Configuration

### SES Setup

1. Verify sender email in SES:
```bash
aws ses verify-email-identity --email-address noreply@veecos.com
```

2. Update template parameters during deployment:
```bash
sam deploy --parameter-overrides \
  SESFromEmail=noreply@veecos.com \
  AdminEmail=admin@veecos.com
```

### Email Templates
Lead notification emails are generated dynamically in `src/handlers/leads.py`. Customize HTML/text templates as needed.

## 🧪 Testing

### Unit Tests
```bash
python -m pytest tests/ -v
```

### Integration Tests (Local SAM)
```bash
sam local start-api --port 3001 &
sleep 2
python tests/integration_test.py
```

### Load Testing
```bash
sam local start-api --port 3001 &
artillery run load-test.yml
```

## 🔍 Monitoring & Logs

### CloudWatch Logs
```bash
sam logs -n GetCategoriesFunction --stack-name veecos-backend
```

### View Recent Logs
```bash
sam logs --stack-name veecos-backend --tail
```

### Lambda Insights (Production)
Add Lambda Insights layer in `template.yaml`:
```yaml
Layers:
  - !Sub 'arn:aws:lambda:${AWS::Region}:580254703988:layer:LambdaInsightsExtension:54'
```

## 💰 Cost Optimization

### DynamoDB On-Demand Pricing
- No upfront provisioning
- Scales automatically
- Ideal for variable traffic patterns
- Monitor usage in CloudWatch

### Lambda Duration
- Average cold start: <500ms
- Typical execution: 50-200ms
- Keep deployment package size <50MB

### API Gateway
- HTTP API costs ~$0.35/million requests
- Lower cost than REST API (~$3.50/million)

## 🚨 Troubleshooting

### Lambda Cold Starts
- **Symptom:** First request is slow
- **Solution:** Enable Lambda SnapStart or use Lambda Power Tuning

### DynamoDB Throttling
- **Symptom:** 400 Bad Request, ProvisionedThroughputExceeded
- **Solution:** Switch to PAY_PER_REQUEST billing (already configured)

### CORS Errors
- **Symptom:** Browser blocks cross-origin requests
- **Solution:** CORS is configured in `template.yaml` for all origins. Adjust as needed for security.

### Email Not Sending
- **Symptom:** Lead submissions fail silently
- **Solution:** 
  1. Verify SES identity in AWS console
  2. Check SES sandbox status (limited to verified addresses in sandbox)
  3. Review CloudWatch logs for SES errors

## 📚 Additional Resources

- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [Lambda Performance Optimization](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

## 📄 License

Proprietary - Veecos Pvt Ltd

## 👥 Support

For issues and questions, contact: backend-team@veecos.com
