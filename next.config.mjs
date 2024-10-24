/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com',
				port: '',
				pathname: '/v0/b/**', // Указываем шаблон пути для корректной загрузки
			},
		],
	},
};

export default nextConfig;
