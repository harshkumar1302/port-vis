import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    const cookies = req.headers.cookie;
    if (!cookies) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = cookies
        .split(";")
        .find((c) => c.trim().startsWith("owner_token="))
        ?.split("=")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("Missing JWT_SECRET environment variable.");
            return res.status(500).json({ error: "Server configuration error" });
        }

        jwt.verify(token, jwtSecret);
        return res.status(200).json({ authenticated: true });
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
