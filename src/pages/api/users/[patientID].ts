// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
	name: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method === 'POST') {
		// Enroll Admin User
		// const { data } = await axios.post('http://localhost:8801/user/enroll', {
		// 	id: 'admin',
		// 	secret: 'adminpw',
		// });
		// const { token: adminToken } = data;
		// console.log('admin token');
		// console.log(adminToken);

		// if (adminToken) {
		// 	const { data } = await axios.post(
		// 		'http://localhost:8801/user/enroll',
		// 		{ id: req.body.id, secret: req.body.email },
		// 		{
		// 			headers: {
		// 				Authorization: `Bearer ${adminToken}`,
		// 			},
		// 		}
		// 	);
		// if (data.token) {
		// const { token: userToken } = data;
		const { patientID } = req.query;
		const { token } = req.body;
		if (patientID && token) {
			const { data } = await axios.post(
				'http://localhost:8801/query/fasthealth-1/fasthealth',
				{
					method: 'FHContract:getPatient',
					args: [`${patientID}`],
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log('API REsponse');
			console.log(data);
			res.status(200).send(data.response);
		}
		// }
		// }
	}
}
