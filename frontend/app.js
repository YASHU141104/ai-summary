document.getElementById('summarize-form').onsubmit = async function(event) {
  event.preventDefault();
  const url = document.getElementById('news-url').value;
  document.getElementById('summary-output').innerText = 'Summarizing...';
  const response = await fetch('http://localhost:3000/summarize', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({url})
  });
  const data = await response.json();
  if (data.summary) {
    document.getElementById('summary-output').innerHTML = `<pre>${data.summary}</pre>`;
  } else {
    document.getElementById('summary-output').innerText = 'Error: ' + data.error;
  }
};
