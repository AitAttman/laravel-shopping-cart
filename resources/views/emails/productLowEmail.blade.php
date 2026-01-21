<table style="border: 2px solid #ea2020; padding: 0.25rem; border-radius: 0.25rem; margin: 0.25rem auto">
    <tbody>
    <tr>
        <th colspan="2" style="text-align: center; font-size: 35px">Product running low!</th>
    </tr>
    <tr style="font-size: 20px; text-align: left">
        <th>ID</th>
        <td><code>{{$product->id}}</code></td>
    </tr>
    <tr style="font-size: 20px; text-align: left">
        <th style="padding-right: 1rem">Name</th>
        <td>{{$product->name}}</td>
    </tr>
    <tr style="font-size: 20px; text-align: left">
        <th>Stock</th>
        <td><span
                style="color: white; background: #ea2020; padding: 0.25rem 1rem; border-radius: 0.25rem">{{$product->stock_quantity}}</span>
        </td>
    </tr>
    </tbody>
</table>
