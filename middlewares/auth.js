const jwt = require("jsonwebtoken"); 

const authenticateUser = (req, res, next) => {
  console.log("headers:", req.headers);

  // Extract the token from the 'Authorization' header
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  const tokenParts = authorizationHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== "bearer") {
    return res
      .status(401)
      .json({ error: "Unauthorized - Invalid token format" });
  }

  const token = tokenParts[1];
  console.log("token:", token);

  try {
    // Verify the token using the secret key stored in process.env.JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // Attach the user ID and token version to the request object for further use
    req.userId = decoded.userId;
    req.tokenVersion = decoded.tokenVersion;
    // console.log(req.userId);
    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

module.exports = authenticateUser;
