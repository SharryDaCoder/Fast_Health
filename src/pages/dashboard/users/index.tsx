import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { Container, Group } from '@mantine/core';
import { getCookie } from 'cookies-next';
import { useQuery } from 'react-query';
import axios from 'axios';
import { PageProps } from '../types';
import { Layout } from '../../../layouts';
import { RecordsTable } from '../components/RecordsTable';
import ProfileCard from '../../../layouts/components/ProfileCard';
// import HospitalList from '../../../layouts/components/HospitalList';
// import { data } from '../../../layouts/components/mock/hospitals';

IndexPage.getLayout = function getLayout(page: any) {
	return <Layout variant={'patient'}>{page}</Layout>;
};

export default function IndexPage({ user }: PageProps) {
	console.log(user);
	const authToken = getCookie('token');
	if (authToken) {
		const { isLoading, error, data } = useQuery('myRecords', async () => {
			const { data } = await axios.post(
				`/api/records/${user.user_metadata.patientID}`,
				{
					token: authToken,
				}
			);
			return data;
		});
		console.log('records list');
		console.log(data);
	}

	return (
		<Container size='xl' py='xl'>
			<Group spacing={50}>
				<ProfileCard
					avatar={``}
					mobile={user.user_metadata.mobile}
					name={user.user_metadata.name}
					email={`${user.email}`}
				/>
				<RecordsTable data={[]} />
			</Group>
		</Container>
	);
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	// Create authenticated Supabase Client
	const supabase = createServerSupabaseClient(ctx);
	// Check if we have a session
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// console.log('cookies');
	// console.log(ctx.req.cookies);

	if (!session)
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};

	return {
		props: {
			initialSession: session,
			user: session.user,
		},
	};
};
