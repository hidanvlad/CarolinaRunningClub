🏃‍♂️ Project Overview
The Carolina Running Club is a specialized management platform designed for running enthusiasts in Alba Iulia. This application allows users to browse community events and enables administrators to manage running logs through a performant, modular web interface.

This project was developed to fulfill the Bronze Challenge requirements, focusing on a clean "Separation of Concerns" and efficient in-memory data management.

1. Presentation View (Landing Page)
Hero Section: High-impact visual introduction to the club.

Info Cards: Modular components showcasing club activities.

Footer: Navigation and social presence.

2. Master View (The Table)
Live Data: Displays a list of runs stored in RAM.

Pagination: Efficiently handles lists by displaying 5 items per page.

Dynamic Routing: Seamlessly transitions between the Landing Page and the Management Dashboard.

3. Detail View
Dedicated Pages: Each run has a unique URL (e.g., /run/123) that displays expanded information.

URL Parameters: Utilizes useParams for dynamic data fetching.

4. Full CRUD Operations
Create: Add new runs via a validated form.

Read: View a comprehensive list and individual details.

Update: Edit existing run details using an "Edit Mode" state.

Delete: Remove runs from memory with a confirmation prompt.