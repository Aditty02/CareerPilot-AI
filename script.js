async function generateRoadmap() {

    const branch = document.getElementById("branch").value;
    const semester = document.getElementById("semester").value;
    const skills = document.getElementById("skills").value;
    const goal = document.getElementById("goal").value;
    const hours = document.getElementById("hours").value;

    document.getElementById("output").innerText = "Generating roadmap...";

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

    document.getElementById("output").innerText = data.response;
}