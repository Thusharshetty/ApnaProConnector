import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt'
import crypto from 'crypto'

import fs from 'fs';
import PDFDocument from 'pdfkit';
import Connection from "../models/connections.model.js";

const convertUserDataToPDF = async (userData) => {
    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(16).toString('hex') + '.pdf';
    const stream = fs.createWriteStream("uploads/" + outputPath);
    doc.pipe(stream);

    doc.image(`uploads/${userData.userId.profilePicture}`, { align: 'center', width: 100 });
    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.userName}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio || 'N/A'}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPost || 'N/A'}`);

    if (userData.pastWork.length > 0) {
        doc.fontSize(16).text('Past Work Experience:', { underline: true });
        userData.pastWork.forEach((work, index) => {
            doc.fontSize(14).text(`${index + 1}. Company: ${work.company}`);
            doc.fontSize(14).text(`   Position: ${work.position}`);
            doc.fontSize(14).text(`   Years: ${work.years}`);
        });
    } else {
        doc.fontSize(14).text('Past Work Experience: N/A');
    }

    if (userData.education.length > 0) {
        doc.fontSize(16).text('Education:', { underline: true });
        userData.education.forEach((edu, index) => {
            doc.fontSize(14).text(`${index + 1}. School: ${edu.school}`);
            doc.fontSize(14).text(`   Degree: ${edu.degree}`);
            doc.fontSize(14).text(`   Field of Study: ${edu.fieldOfStudy}`);
        });
    } else {
        doc.fontSize(14).text('Education: N/A');
    }

    doc.end();

    return outputPath;
}




export const register = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: 'Please fill all the fields' })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            userName: username
        });
        await newUser.save();
        const profile = new Profile({
            userId: newUser._id,
        })
        await profile.save();
        return res.status(201).json({ message: 'User registered successfully' })


    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User does not exist' })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }
        const token = await crypto.randomBytes(64).toString('hex');
        user.token = token;
        await user.save();
        return res.status(200).json({ message: 'Login successful', token })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const uploadProfilePic = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token is required' })
    }
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' })
        }
        user.profilePicture = req.file.filename;
        await user.save();
        return res.status(200).json({ message: 'Profile picture uploaded successfully', profilePicture: req.file.path })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }

}

export const updateUserprofile = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Token is required' })
        }
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const { userName, email } = newUserData;
        if (userName) {
            const existingUserName = await User.findOne({ userName });
            if (existingUserName && existingUserName._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: 'Username already taken' })
            }
        }
        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: 'Email already taken' })
            }
        }
        Object.assign(user, newUserData);
        await user.save();
        return res.status(200).json({ message: 'Profile updated successfully' })

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const getUserAndProfile = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Token is required' })
        }
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const userprofile = await Profile.findOne({ userId: user._id }).populate('userId', 'name userName email profilePicture');
        return res.status(200).json({ profile: userprofile })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const updateProfileData = async (req, res) => {
    try {
        const { token, ...newProfileData } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Token is required' })
        }
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const profile = await Profile.findOne({ userId: user._id });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' })
        }
        Object.assign(profile, newProfileData);
        await profile.save();
        return res.status(200).json({ message: 'Profile updated successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const getAllUserProfile = async (req, res) => {
    try {
        const profiles = await Profile.find().populate('userId', 'name userName email profilePicture');
        if (!profiles) {
            return res.status(404).json({ message: 'No profiles found' })
        }
        return res.status(200).json({ profiles: profiles })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const downloadProfile = async (req, res) => {
    try {
        const userId = req.query.id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' })
        }
        const profile = await Profile.findOne({ userId }).populate('userId', 'name userName email profilePicture');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' })
        }
        const outputPath = await convertUserDataToPDF(profile);
        return res.status(200).json({ message: 'Profile downloaded successfully', outputPath });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const sendConnectionRequest = async (req, res) => {
    try {
        const { token, receiverId } = req.body;
        if (!token || !receiverId) {
            return res.status(400).json({ message: 'Token and Receiver ID are required' })
        }
        const sender = await User.findOne({ token });
        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' })
        }
        const receiver = await User.findById({ _id: receiverId });
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' })
        }
        const AlreadysentRequest = await Connection.findOne({ userId: sender._id, connectionId: receiver._id });
        if (AlreadysentRequest) {
            return res.status(400).json({ message: 'Connection request already sent' })
        }
        const newConnection = new Connection({
            userId: sender._id,
            connectionId: receiver._id,
            status_accepted: null
        });
        await newConnection.save();
        return res.status(200).json({
            message: 'Connection request sent successfully'
        })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const getMyConnectionsRequests = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Token is required' })
        }
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const connections = await Connection.find({ userId: user._id }).populate('connectionId', 'name userName email profilePicture');
        return res.status(200).json({ connections })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const whoSentMeConnectionRequest = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Token is required' })
        }
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const connections = await Connection.find({ connectionId: user._id }).populate('userId', 'name userName email profilePicture');
        return res.status(200).json({ connections })

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const acceptConnectionRequest = async (req, res) => {
    try {
        const { token, requestId, action_type } = req.body;
        if (!token || !requestId || !action_type) {
            return res.status(400).json({ message: 'Token, Request ID and Action Type are required' })
        }
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const connectionRequest = await Connection.findById({ _id: requestId });
        if (!connectionRequest) {
            return res.status(404).json({ message: 'Connection request not found' })
        }
        if (action_type === 'accept') {
            connectionRequest.status_accepted = true;
        } else if (action_type === 'reject') {
            connectionRequest.status_accepted = false;
        } else {
            return res.status(400).json({ message: 'Invalid action type' })
        }
        await connectionRequest.save();
        return res.status(200).json({ message: `Connection request ${action_type}ed successfully` })

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}