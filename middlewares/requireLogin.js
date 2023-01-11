const mongoose = require('mongoose');
const User = mongoose.model('User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client([process.env.ANDROID_CLIENT_ID, process.env.IOS_CLIENT_ID]);

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    // authorization === Bearer jwt_token
    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in1" }); // code 401 means unauthorized
    }
    const token = authorization.replace("Bearer ", "");

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            requiredAudience: [process.env.ANDROID_CLIENT_ID, process.env.IOS_CLIENT_ID],  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log('uid: ' + userid);
        User.find({ id: userid }).then((userData) => {
            console.log('user found-----', userData[0]);
            req.user = userData[0];
            next();
        });
    }

    verify().catch(err => console.error("idToken verifyIdToken error: " + err));

    console.log('ho gya verifyIdToken');
}
