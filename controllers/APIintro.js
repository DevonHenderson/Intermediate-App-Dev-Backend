// Initial endpoint at the root of the API
const APIintro = (req, res) => {
    const message = `
        <p>Welcome to the API for Devon's Intermediate App Dev 2024 projects</p>
        <p>Current Endpoints:</p>
        <ul>
            <li>/api/user</li>
        </ul>
    `;

    res.send(message);
}

export { APIintro }