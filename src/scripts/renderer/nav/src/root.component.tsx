import {BrowserRouter, Link} from "react-router-dom";

export default function Root(props) {
	const baseUrl = window.location.pathname;
	return (
		<BrowserRouter basename={baseUrl}>
			<div>
				<ul>
					<li>
						<Link to="/" >Home</Link>
					</li>
					<li>
						<Link to="/tools/msanose" >MSA Nose</Link>
					</li>
				</ul>
			</div>
		</BrowserRouter>
	);

}
