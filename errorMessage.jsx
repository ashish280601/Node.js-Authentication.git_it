import { useRouteError } from "react-router-dom"

const ErrorMessage = () => {
    const error = useRouteError();

    return(
        <div>
            <h1>OOPS!</h1>
            <p>Sorry an unexpected error has occurred</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    )
}

export default ErrorMessage;