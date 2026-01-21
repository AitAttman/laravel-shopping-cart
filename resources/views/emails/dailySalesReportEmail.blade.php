<p style="text-align: center; font-size: 2rem">Sales Report {{$date}}</p>
<table
    style="padding: 0.25rem; border-radius: 0.25rem; margin: 0.25rem auto; border-collapse: collapse; border: 1px solid #ccc">
    <tbody>
    <tr style="border-bottom: 1px solid #ccc">
        <th style="padding: 0.35rem; text-align: left; min-width: 50px">ID</th>
        <th style="padding: 0.35rem; text-align: left">Name</th>
        <th style="padding: 0.35rem; text-align: right">Quantity</th>
        <th style="padding: 0.35rem; text-align: right; min-width: 50px">Total</th>
    </tr>
    @foreach( $sales as $item )
        <tr>
            <td style="padding: 0.25rem">{{$item->product_id ?? ''}}</td>
            <td style="padding: 0.25rem">{{$item->product_name ?? ""}}</td>
            <td style="padding: 0.25rem; text-align: right">{{$item->total_qty ?? ""}}</td>
            <td style="padding: 0.25rem; text-align: right">{{$item->total ?? ""}}</td>
        </tr>
    @endforeach
    </tbody>
</table>
