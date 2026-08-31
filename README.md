Business Contact Manager

IFN636 Assessment 1 — Business Contact Manager

A web-based supplier management application for procurement teams. The system supports role-based access, supplier onboarding and approval, supplier contact management, and supplier lifecycle management.

Tech Stack

- Frontend: React.js
- Backend: Node.js
- Database: MongoDB Atlas
- Authentication: JWT
- Deployment: AWS EC2

Development Tools

- Git / GitHub
- Jira

User Roles

Procurement Officer
- Create suppliers for Admin approval
- View own pending suppliers
- View and edit supplier information
- Add and edit supplier contacts
- Set a Main Contact
- Deactivate and reactivate suppliers

Admin
- Create suppliers that become Active immediately
- View all pending suppliers
- Approve or reject supplier submissions
- View and edit supplier information
- Add and edit supplier contacts
- Set a Main Contact
- Deactivate and reactivate suppliers

Core Workflows

1. Supplier Onboarding and Approval

Officer creates supplier → Pending Approval → Admin approves or rejects → Active or Rejected.

Admin-created suppliers become Active immediately.

2. Supplier Contact Management

User opens supplier → adds or edits contact → required fields are validated → Main Contact can be set → changes are saved.

Architecture Summary

React frontend → REST API → Node.js backend → MongoDB Atlas.

JWT authentication and role-based access control are used to distinguish Officer and Admin permissions.

Local Setup

1. Clone the repository

git clone https://github.com/jessielu-qut/Business-Contact-Manager.git
cd Business-Contact-Manager

2. Install dependencies

npm install
npm install --prefix backend
npm install --prefix frontend

3. Create backend/.env

MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<your JWT secret>
PORT=5001

Ensure your current IP address is allowed in MongoDB Atlas Network Access.

4. Start the application

npm start

Local URLs

Frontend: http://localhost:3000
Backend: http://localhost:5001

Known Limitations

- Staff accounts are created and managed externally by the company IT department; account creation is outside the scope of this system.
- Supplier Qualification Management is deferred and not included in the final application.
- Supplier contact deletion is not implemented.

Release

v1.0.0

Deployment

Platform: AWS EC2

Live URL:
To be updated after final EC2 deployment.

Demo Accounts

Officer
Name: Officer1
Email: officer1@bcm.com
Password: Officer1

Admin
Name: Admin
Email: admin@bcm.com
Password: Admin1234