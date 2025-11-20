import axios from 'axios';

export const getGitHubUser = async (accessToken) => {
    try {
        const response = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch GitHub user data');
    }
};

export const getGitHubAccessToken = async (code) => {
    try {
        const response = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        );

        return response.data.access_token;
    } catch (error) {
        throw new Error('Failed to get GitHub access token');
    }
};

export const getGitHubUserRepos = async (accessToken) => {
    try {
        const response = await axios.get('https://api.github.com/user/repos', {
            headers: {
                Authorization: `token ${accessToken}`,
            },
            params: {
                sort: 'updated',
                per_page: 10,
            },
        });

        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch GitHub repositories');
    }
};