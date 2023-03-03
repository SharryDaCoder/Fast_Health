import { useState } from 'react';
import {
	Badge,
	Box,
	Button,
	createStyles,
	Table,
	ScrollArea,
	UnstyledButton,
	Group,
	Text,
	Center,
	TextInput,
	Modal,
} from '@mantine/core';
import { keys } from '@mantine/utils';
import {
	IconSelector,
	IconChevronDown,
	IconChevronUp,
	IconSearch,
} from '@tabler/icons';
import Note, { NoteProps } from './Note';

const useStyles = createStyles((theme) => ({
	th: {
		padding: '0 !important',
	},

	control: {
		width: '100%',
		padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark'
					? theme.colors.dark[6]
					: theme.colors.gray[0],
		},
	},

	icon: {
		width: 21,
		height: 21,
		borderRadius: 21,
	},
}));

interface RowData {
	noteID: string;
	patientID: string;
	patientName: string;
	paramedicID: string;
	paramedicName: string;
	paramedicNote: string;
	createdAt: string;
}

interface TableSortProps {
	data: RowData[];
}

interface ThProps {
	children: React.ReactNode;
	reversed?: boolean;
	sorted?: boolean;
	onSort?(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
	const { classes } = useStyles();
	const Icon = sorted
		? reversed
			? IconChevronUp
			: IconChevronDown
		: IconSelector;
	return (
		<th className={classes.th}>
			<UnstyledButton onClick={onSort} className={classes.control}>
				<Group position='apart'>
					<Text weight={500} size='sm'>
						{children}
					</Text>
					<Center className={classes.icon}>
						<Icon size={14} stroke={1.5} />
					</Center>
				</Group>
			</UnstyledButton>
		</th>
	);
}

function filterData(data: RowData[], search: string) {
	const query = search.toLowerCase().trim();
	return data.filter((item) =>
		keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
	);
}

function sortData(
	data: RowData[],
	payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
	const { sortBy } = payload;

	if (!sortBy) {
		return filterData(data, payload.search);
	}

	return filterData(
		[...data].sort((a, b) => {
			if (payload.reversed) {
				return b[sortBy].localeCompare(a[sortBy]);
			}

			return a[sortBy].localeCompare(b[sortBy]);
		}),
		payload.search
	);
}

export default function NotesList({ data }: any) {
	const parsedData = data.map((item: string) => JSON.parse(item));
	const [note, setNote] = useState<RowData | null>(null);
	console.log('data');

	console.log(data);
	const [opened, setOpened] = useState(false);
	const [search, setSearch] = useState('');
	const [sortedData, setSortedData] = useState(parsedData);
	const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
	const [reverseSortDirection, setReverseSortDirection] = useState(false);

	const setSorting = (field: keyof RowData) => {
		const reversed = field === sortBy ? !reverseSortDirection : false;
		setReverseSortDirection(reversed);
		setSortBy(field);
		setSortedData(sortData(parsedData, { sortBy: field, reversed, search }));
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;
		setSearch(value);
		setSortedData(
			sortData(parsedData, {
				sortBy,
				reversed: reverseSortDirection,
				search: value,
			})
		);
	};

	const rows = sortedData.map((row: NoteProps) => (
		<tr key={row.patientName}>
			<td>{row.patientName}</td>
			<td>{row.paramedicName}</td>
			<td>{row.createdAt}</td>

			<td>
				{
					<Button
						onClick={() => {
							setNote(row);
							setOpened(true);
						}}
						variant='outline'
						size='sm'
					>
						view
					</Button>
				}
			</td>
		</tr>
	));

	return (
		<Box
			sx={{
				// width: '70vw',
				height: '500px',
				padding: '10px',
			}}
		>
			<Modal opened={opened} onClose={() => setOpened(false)}>
				{/* <HospitalCard hospital_ID={hospital} id={id} email={email} /> */}
				<Note data={note} />
			</Modal>

			<Text size={'md'} align={'center'} weight={'bold'} pb={25}>
				All Notes
			</Text>
			<TextInput
				placeholder='Search by any field'
				mb='md'
				icon={<IconSearch size={14} stroke={1.5} />}
				value={search}
				onChange={handleSearchChange}
			/>

			<Table
				horizontalSpacing='xs'
				verticalSpacing='xs'
				sx={{
					// tableLayout: 'fixed',
					height: '50px',
					overflowY: 'scroll',
				}}
			>
				<thead>
					<tr>
						<Th
							sorted={sortBy === 'patientName'}
							reversed={reverseSortDirection}
							onSort={() => setSorting('patientName')}
						>
							Patient Name
						</Th>
						<Th
							sorted={sortBy === 'paramedicName'}
							reversed={reverseSortDirection}
						>
							Paramedic Name
						</Th>
						<Th>Date Created</Th>
						<Th>Action</Th>
					</tr>
				</thead>
				<tbody>
					{rows.length > 0 ? (
						rows
					) : (
						<tr>
							<td colSpan={Object.keys(parsedData[0]).length}>
								<Text weight={500} align='center'>
									Nothing found
								</Text>
							</td>
						</tr>
					)}
				</tbody>
			</Table>
		</Box>
	);
}
