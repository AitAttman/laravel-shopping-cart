import { AdminTransactionRowType, StateType } from '@/types/ait';
import { Dispatch, SetStateAction, useState } from 'react';

export default function TransactionRow({tr, setTrs = null }: {tr: AdminTransactionRowType, key:number, setTrs: Dispatch<SetStateAction<AdminTransactionRowType[]>>|null}) {
    const [state, setState] = useState<StateType>({loading: false, successMessage: "", errorMessage: "" });
    return (<tr>
        <td>{tr.id}</td>
        <td>{tr.type_label}</td>
        <td>{tr.status_label}</td>
        <td>{tr.user_name}</td>
        <td>{tr.date}</td>
        <td>the action here</td>
    </tr>)
}
