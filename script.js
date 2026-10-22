async function generateRoadmap() {
    const output = document.getElementById("output");
    const button = document.querySelector("button");
    const payload = Object.fromEntries(["branch", "semester", "skills", "goal", "hours"]
        .map((id) => [id, document.getElementById(id).value]));

    output.innerHTML = '<p class="placeholder">⏳ Generating your personalized roadmap… Please wait.</p>';
    button.disabled = true;
    button.textContent = "Generating…";
    try {
        const response = await fetch("http://127.0.0.1:5000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Request failed");
        output.innerHTML = renderMarkdown(data.response || "No roadmap was returned.");
    } catch (error) {
        output.textContent = "Something went wrong. Please try again.";
    } finally {
        button.disabled = false;
        button.textContent = "🚀 Generate AI Roadmap";
    }
}

// Support common Markdown formatting while escaping all model text as HTML.
function renderMarkdown(markdown) {
    const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
    const inline = (value) => escapeHtml(value)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/__([^_]+)__/g, "<strong>$1</strong>")
        .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>")
        .replace(/(?<!_)_([^_]+)_(?!_)/g, "<em>$1</em>");

    const html = [];
    let list = null;
    let paragraph = [];
    const closeList = () => { if (list) { html.push(`</${list}>`); list = null; } };
    const flushParagraph = () => {
        if (paragraph.length) { html.push(`<p>${inline(paragraph.join(" "))}</p>`); paragraph = []; }
    };
    for (const line of String(markdown).replace(/\r\n?/g, "\n").split("\n")) {
        const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+)$/);
        const item = line.match(/^\s*(?:[-*+]\s+|\d+[.)]\s+)(.+)$/);
        if (heading) {
            flushParagraph(); closeList();
            const level = heading[1].length;
            html.push(`<h${level}>${inline(heading[2].trim())}</h${level}>`);
        } else if (item) {
            flushParagraph();
            const type = /^\s*\d+[.)]\s+/.test(line) ? "ol" : "ul";
            if (list !== type) { closeList(); list = type; html.push(`<${list}>`); }
            html.push(`<li>${inline(item[1])}</li>`);
        } else if (/^\s*[-*_]{3,}\s*$/.test(line)) {
            flushParagraph(); closeList(); html.push("<hr>");
        } else if (!line.trim()) {
            flushParagraph(); closeList();
        } else {
            closeList(); paragraph.push(line.trim());
        }
    }
    flushParagraph(); closeList();
    return html.join("\n");
}
