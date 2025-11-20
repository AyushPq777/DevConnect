import Job from '../models/Job.js';

// @desc    Create job posting
// @route   POST /api/jobs
export const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            remote,
            type,
            salary,
            description,
            requirements,
            skills,
            expiryDate
        } = req.body;

        const job = await Job.create({
            title,
            company,
            location,
            remote: remote === 'true',
            type,
            salary: salary ? JSON.parse(salary) : {},
            description,
            requirements: requirements ? requirements.split(',').map(req => req.trim()) : [],
            skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
            postedBy: req.user.id,
            expiryDate: expiryDate ? new Date(expiryDate) : null
        });

        await job.populate('postedBy', 'username avatar');

        res.status(201).json({
            success: true,
            data: { job }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
export const getJobs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, type, location, remote, skills } = req.query;

        let query = { isActive: true };

        if (search) {
            query.$text = { $search: search };
        }

        if (type) {
            query.type = type;
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (remote !== undefined) {
            query.remote = remote === 'true';
        }

        if (skills) {
            const skillsArray = skills.split(',').map(skill => new RegExp(skill.trim(), 'i'));
            query.skills = { $in: skillsArray };
        }

        const jobs = await Job.find(query)
            .populate('postedBy', 'username avatar')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Job.countDocuments(query);

        res.json({
            success: true,
            data: {
                jobs,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
export const getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'username avatar')
            .populate('applications.user', 'username avatar email');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.json({
            success: true,
            data: { job }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Apply for job
// @route   POST /api/jobs/:id/apply
export const applyForJob = async (req, res) => {
    try {
        const { coverLetter } = req.body;
        const resume = req.file ? req.file.path : null;

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if already applied
        const alreadyApplied = job.applications.some(
            app => app.user.toString() === req.user.id
        );

        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        const application = {
            user: req.user.id,
            coverLetter,
            resume
        };

        job.applications.push(application);
        await job.save();

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user's job applications
// @route   GET /api/jobs/my-applications
export const getMyApplications = async (req, res) => {
    try {
        const jobs = await Job.find({
            'applications.user': req.user.id
        })
            .populate('postedBy', 'username avatar company')
            .select('title company location type applications');

        const applications = jobs.flatMap(job =>
            job.applications
                .filter(app => app.user.toString() === req.user.id)
                .map(app => ({
                    job: {
                        id: job._id,
                        title: job.title,
                        company: job.company,
                        location: job.location,
                        type: job.type
                    },
                    application: app
                }))
        );

        res.json({
            success: true,
            data: { applications }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get jobs posted by user
// @route   GET /api/jobs/my-jobs
export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.id })
            .populate('applications.user', 'username avatar')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { jobs }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};