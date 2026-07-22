async function generateRoadmap() {

    const branch = document.getElementById("branch").value;
    const semester = document.getElementById("semester").value;
    const skills = document.getElementById("skills").value;
    const goal = document.getElementById("goal").value;
    const hours = document.getElementById("hours").value;

    const output = document.getElementById("output");
    const button = document.querySelector("button");

    // Show loading message
    output.innerText = "⏳ Generating your personalized roadmap...\n\nPlease wait...";

    // Disable button while loading
    button.disabled = true;
    button.innerText = "Generating...";

    try {

        const response = await fetch("http://127.0.0.1:5000/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                branch,
                semester,
                skills,
                goal,
                hours
            })
        });

        const data = await response.json();

        output.innerText = data.response;

    } catch (error) {

        output.innerText = "❌ Something went wrong. Please try again.";

    }

    // Re-enable button
    button.disabled = false;
    button.innerText = "🚀 Generate AI Roadmap";
}