const authService = require("../../services/auth/auth.service");


// OTP VERIFY
exports.verifyOTP = async (req, res) => {
    const result = await authService.verifyOTP(req.body);
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
    });
    res.status(200).json({ "accessToken": result.accessToken, "user": result.user });
};
// OTP REQUEST
exports.requestOTP = async (req, res) => {

    const result = await authService.requestOTP(req.body);
    res.status(200).json(result);
};
// OTP RESEND
exports.resendOTP = async (req, res) => {
    const result = await authService.resendOTP(req.body);
    res.status(200).json(result);
};
// REGISTRATION
exports.register_zp_admin = async (req, res) => {
    req.body.user = req.user;
    const result = await authService.addZPAdmin(req.body);
    res.status(201).json(result)
};

exports.register_dept_head = async (req, res) => {
    req.body.user = req.user;
    const result = await authService.addDeptHead(req.body);
    res.status(201).json(result)
};

exports.login = async (req, res) => {
    const result = await authService.loginUser(req.body);
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
    })
    res.status(200).json({ "accessToken": result.accessToken, "user": result.user });
};

exports.refresh = async (req, res) => {
    const result = await authService.refreshToken(req.cookies);
    res.status(200).json(result);
}

exports.logout = async (req, res) => {
    await authService.logoutUser(req.cookies);
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
};

exports.initiateAuth = async (req, res) => {
    const result = await authService.initiateAuth(req.body);
    // res.clearCookie("refreshToken");
    res.status(200).json(result);
};