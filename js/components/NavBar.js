class NavHome {

    constructor (){}

    render(){
        return (`
            
            <div class='top' role='lien'>
                <a aria-label='Retour' href='index.html' class='header-png'>
                    <img role='img' alt='logo' src='/assets/img/logo.svg'/>
                </a>   
            </div>
        `)
    }
}

export default NavHome;