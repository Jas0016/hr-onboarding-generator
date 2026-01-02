# HR Onboarding Document Generator

## Overview
The HR Onboarding Document Generator is a full-stack web application that helps HR teams generate customized onboarding documents for new employees. The system allows HR to select onboarding elements such as company policies, employee benefits, and team introduction, preview the generated document, download it as a PDF, and track document generation history by employee.

This project demonstrates real-world document automation workflows commonly used in HR systems.

---

## Features

### 1. Employee Onboarding Form
- Enter employee name
- Enter employee role
- Select onboarding elements:
  - Company Policies
  - Employee Benefits
  - Team Introduction

### 2. Dynamic Template System
- Onboarding templates are stored in MongoDB
- Each template contains a title and content
- Templates are dynamically fetched and merged based on HR selections

### 3. Document Preview
- HR can preview the onboarding document in the browser
- Preview reflects the selected templates and employee details
- Preview content exactly matches the downloadable PDF

### 4. PDF Generation
- Generates a professional onboarding document in PDF format
- Uses `pdfkit` for server-side PDF creation
- One-click download after preview

### 5. Document History Tracking
- Tracks document generation history by employee
- Displays employee name, role, and generation timestamp
- History is accessible via a dedicated **History** button for clean UI

---

## Technology Stack

### Frontend
- React.js
- Fetch API for backend communication

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose

### Document Generation
- pdfkit

### Database
- MongoDB Atlas

---

## AI Integration (Design Note)
The system is designed to support AI-based document generation using OpenAI or Claude APIs.  
In this implementation:
- Stored templates simulate AI-generated clauses
- Template merging logic demonstrates how AI output would be structured and formatted
- AI integration can be enabled by replacing the template merge logic with an OpenAI or Claude API call

This approach keeps the project deterministic, testable, and cost-free while preserving AI-readiness.

---

## How to Run Locally

### Backend
```bash
cd backend
npm install
npm start
