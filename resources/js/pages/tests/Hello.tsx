export default function Hello(props) {
    console.log( props )
    return (
        <div className="p-2 bg-secondary"><h1>This is hello component, and it's good</h1>
            <div>{props.quote?.author || "No Author"} has said <b>{props.quote?.message ||"nothing" }</b></div>
        <span>and the email is <b>{props.email || ""}</b></span>
            <div className="columns-3xs">
                <div className="bg-red-300">hello</div>
                <div className="my-component text-yellow-100">hello</div>
                <div className="bg-red-600">hello</div>
            </div>
        </div>
    )
}
