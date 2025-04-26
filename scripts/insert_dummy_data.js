const dummyData = [
    {
        company: "Google",
        title: "Senior Software Engineer",
        status: "Applied",
        location: "Mountain View, CA",
        link: "https://careers.google.com",
        skills: ["Python", "Go", "Kubernetes", "Machine Learning"],
        application_date: new Date(2024, 2, 15).toISOString()
    },
    {
        company: "Microsoft",
        title: "Full Stack Developer",
        status: "Interviewing",
        location: "Redmond, WA",
        link: "https://careers.microsoft.com",
        skills: ["React", "Node.js", "TypeScript", "Azure"],
        application_date: new Date(2024, 2, 1).toISOString()
    },
    {
        company: "Amazon",
        title: "Software Development Engineer II",
        status: "Rejected",
        location: "Seattle, WA",
        link: "https://amazon.jobs",
        skills: ["Java", "AWS", "System Design", "Distributed Systems"],
        application_date: new Date(2024, 1, 20).toISOString()
    },
    {
        company: "Apple",
        title: "iOS Developer",
        status: "Offered",
        location: "Cupertino, CA",
        link: "https://apple.com/careers",
        skills: ["Swift", "SwiftUI", "iOS", "XCode"],
        application_date: new Date(2024, 1, 10).toISOString()
    },
    {
        company: "Meta",
        title: "Frontend Engineer",
        status: "Applied",
        location: "Menlo Park, CA",
        link: "https://metacareers.com",
        skills: ["React", "JavaScript", "GraphQL", "CSS"],
        application_date: new Date(2024, 0, 25).toISOString()
    },
    {
        company: "Netflix",
        title: "Senior Backend Engineer",
        status: "Interviewing",
        location: "Los Gatos, CA",
        link: "https://jobs.netflix.com",
        skills: ["Java", "Spring Boot", "Microservices", "Kafka"],
        application_date: new Date(2024, 0, 15).toISOString()
    }
];

// Function to insert a single application
async function insertApplication(application, token, username) {
    const response = await fetch(`http://localhost:8080/apps/${username}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(application)
    });

    if (!response.ok) {
        throw new Error(`Failed to insert application for ${application.company}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Successfully inserted application for ${application.company}`);
    return data;
}

// Main function to insert all dummy data
async function insertDummyData() {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found in localStorage');
        return;
    }

    // Get username from token
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const username = tokenPayload.sub;

    console.log('Starting to insert dummy data...');

    for (const application of dummyData) {
        try {
            await insertApplication(application, token, username);
        } catch (error) {
            console.error('Error inserting application:', error);
        }
    }

    console.log('Finished inserting dummy data');
}

// Execute the script
insertDummyData().catch(console.error); 