exports.reqBody = (req, res, next) => {
    console.log("Request Body:", req.body);
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request Body is Required" });
    }
    next();
};