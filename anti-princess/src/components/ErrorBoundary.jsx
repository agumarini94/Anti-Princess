import React from 'react'

// los errores SON componentes Clase de react
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        //estado inicial:  esta bien.
        this.state = { hasError: false };
    }
    //este metodo static, se activa automaticamente cuando un componente hijo lanza un error 
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    render() {
        //si el estado dice que hay un error, muestro el cartel de prohibido
        if (this.state.hasError) {
            return (
                <div style={{
                    textAlign: 'center',
                    padding: '50px',
                    backgroundColor: 'black',
                    color: 'red',
                    height: '100vh'
                }}>
                    <h1>ERROR 404</h1>
                    <h2 style={{ fontSize: '3rem' }}>This app is prohibited for Princess</h2>
                    <button onClick={() => {
                        this.setState({ hasError: false });
                        window.history.pushState({}, '', '/');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                    }}>
                        Go back, I wont be princess
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
