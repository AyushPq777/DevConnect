import Post from '../models/Post.js';
import User from '../models/User.js';

// @desc    Create a new post
// @route   POST /api/posts
export const createPost = async (req, res) => {
    try {
        console.log('🚀 === POST CREATION STARTED ===');
        console.log('📝 Request user:', req.user ? `User: ${req.user.username} (ID: ${req.user.id})` : 'NO USER');
        console.log('📦 Request body:', JSON.stringify(req.body, null, 2));

        // DEEP DEBUG: Check if content already contains username
        if (req.body.content) {
            console.log('🔍 CONTENT ANALYSIS:');
            console.log('   Raw content:', req.body.content);
            console.log('   Content lines:', req.body.content.split('\n'));
            console.log('   Contains username?', req.body.content.includes(req.user?.username || ''));
        }

        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            console.log('❌ No user authenticated');
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        const { title, content, tags, codeSnippets, coverImage } = req.body;

        // Validate required fields
        if (!title || !content) {
            console.log('❌ Missing title or content');
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        console.log('💾 Creating post in database...');

        // ✅ FIX: Clean the content - remove username if present
        let cleanedContent = content;

        // Remove the username if it's the first line
        const contentLines = content.split('\n');
        if (contentLines.length > 0 && contentLines[0].includes(req.user.username)) {
            console.log('🔧 Removing username from content...');
            cleanedContent = contentLines.slice(1).join('\n').trim();
        }

        // Create post data with CLEANED content
        const postData = {
            title: title.trim(),
            content: cleanedContent, // ✅ Use cleaned content
            author: req.user.id,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            coverImage: coverImage || ''
        };

        // Handle code snippets safely
        if (codeSnippets && codeSnippets.length > 0) {
            try {
                postData.codeSnippets = typeof codeSnippets === 'string'
                    ? JSON.parse(codeSnippets)
                    : codeSnippets;
            } catch (parseError) {
                console.log('⚠️ Error parsing codeSnippets, using empty array');
                postData.codeSnippets = [];
            }
        } else {
            postData.codeSnippets = [];
        }

        console.log('📄 Final post data to save:', JSON.stringify(postData, null, 2));
        console.log('🔍 Final content analysis:', {
            contentLength: postData.content.length,
            firstLine: postData.content.split('\n')[0],
            containsUsername: postData.content.includes(req.user.username)
        });

        const post = await Post.create(postData);
        console.log('✅ Post created successfully with ID:', post._id);

        // Populate author details
        await post.populate('author', 'username avatar');

        console.log('🎉 === POST CREATION COMPLETED ===');
        console.log('📤 Sending response with post:', {
            id: post._id,
            title: post.title,
            contentPreview: post.content.substring(0, 100) + '...',
            author: post.author.username
        });

        res.status(201).json({
            success: true,
            data: { post }
        });

    } catch (error) {
        console.error('💥 === POST CREATION ERROR ===');
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);

        if (error.name === 'ValidationError') {
            console.error('📋 Validation errors:', error.errors);
        }

        console.error('💥 === END ERROR ===');

        res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        });
    }
};

// @desc    Get all posts
// @route   GET /api/posts
export const getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, tag, search, author } = req.query;

        let query = { isPublished: true };

        // ✅ IMPROVED: Better search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (tag) {
            query.tags = { $in: [new RegExp(tag, 'i')] };
        }

        if (author) {
            const authorUser = await User.findOne({ username: author });
            if (authorUser) {
                query.author = authorUser._id;
            }
        }

        const posts = await Post.find(query)
            .populate('author', 'username avatar')
            .populate('comments.user', 'username avatar')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Post.countDocuments(query);

        res.json({
            success: true,
            data: {
                posts,
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

// @desc    Get single post
// @route   GET /api/posts/:id
export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username avatar bio')
            .populate('comments.user', 'username avatar')
            .populate('likes', 'username avatar');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Increment view count
        post.viewCount += 1;
        await post.save();

        res.json({
            success: true,
            data: { post }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
export const updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check ownership
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this post'
            });
        }

        post = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('author', 'username avatar');

        res.json({
            success: true,
            data: { post }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check ownership
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this post'
            });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
export const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const hasLiked = post.likes.includes(req.user.id);

        if (hasLiked) {
            // Unlike
            post.likes = post.likes.filter(
                like => like.toString() !== req.user.id
            );
        } else {
            // Like
            post.likes.push(req.user.id);
        }

        await post.save();

        res.json({
            success: true,
            data: {
                isLiked: !hasLiked,
                likeCount: post.likes.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
export const addComment = async (req, res) => {
    try {
        const { content } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const comment = {
            user: req.user.id,
            content
        };

        post.comments.push(comment);
        await post.save();

        // Populate the new comment
        await post.populate('comments.user', 'username avatar');

        const newComment = post.comments[post.comments.length - 1];

        res.status(201).json({
            success: true,
            data: { comment: newComment }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};