

function getColor(color){
    if(!color){
        return 'bg-primary-dark'
    }
    if(color[0] === '#'){
        return "bg-["+color+"]"
    }
    return "bg-"+color
}

function getImageColor(color){
    if(!color){
        return 'white'
    }
    if(color[0] === '#'){
        return "["+color+"]"
    }
    return color
}

function getTooltipColor(color){
    if(!color){
        return 'bg-primary-dark'
    }
    if(color[0] === '#'){
        return "bg-["+color+"]"
    }
    return "bg-"+color
}

function getChildrenSideStyle(side){
    if(!side || side === "top"){
        return "bottom-8 -translate-x-1/2"
    }

    if(side === "bottom"){
        return "top-8 -translate-x-1/2"
    }

    if(side === "right"){
        return "left-8 -translate-y-1/2"
    }

    if(side === "left"){
        return "right-8 -translate-y-1/2"
    }
}

function getArrowSideStyle(side){
    if(!side || side === "top"){
        return "-translate-x-1/2 left-1/2"
    }

    if(side === "bottom"){
        return "-translate-x-1/2 left-1/2 -top-2"
    }

    if(side === "right"){
        return "-translate-y-1/2 top-1/2 -left-2"
    }

    if(side === "left"){
        return "-translate-y-1/2 top-1/2 -right-2"
    }
}


function getImage(type){
    if(!type || type==='help'){
        return(
            <svg viewBox="0 0 512 512" fill="inherit">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier"> 
                    <g> 
                    <path d="M396.138,85.295c-13.172-25.037-33.795-45.898-59.342-61.03C311.26,9.2,280.435,0.001,246.98,0.001 c-41.238-0.102-75.5,10.642-101.359,25.521c-25.962,14.826-37.156,32.088-37.156,32.088c-4.363,3.786-6.824,9.294-6.721,15.056 c0.118,5.77,2.775,11.186,7.273,14.784l35.933,28.78c7.324,5.864,17.806,5.644,24.875-0.518c0,0,4.414-7.978,18.247-15.88 c13.91-7.85,31.945-14.173,58.908-14.258c23.517-0.051,44.022,8.725,58.016,20.717c6.952,5.941,12.145,12.594,15.328,18.68 c3.208,6.136,4.379,11.5,4.363,15.574c-0.068,13.766-2.742,22.77-6.603,30.442c-2.945,5.729-6.789,10.813-11.738,15.744 c-7.384,7.384-17.398,14.207-28.634,20.479c-11.245,6.348-23.365,11.932-35.612,18.68c-13.978,7.74-28.77,18.858-39.701,35.544 c-5.449,8.249-9.71,17.686-12.416,27.641c-2.742,9.964-3.98,20.412-3.98,31.071c0,11.372,0,20.708,0,20.708 c0,10.719,8.69,19.41,19.41,19.41h46.762c10.719,0,19.41-8.691,19.41-19.41c0,0,0-9.336,0-20.708c0-4.107,0.467-6.755,0.917-8.436 c0.773-2.512,1.206-3.14,2.47-4.668c1.29-1.452,3.895-3.674,8.698-6.331c7.019-3.946,18.298-9.276,31.07-16.176 c19.121-10.456,42.367-24.646,61.972-48.062c9.752-11.686,18.374-25.758,24.323-41.968c6.001-16.21,9.242-34.431,9.226-53.96 C410.243,120.761,404.879,101.971,396.138,85.295z"></path> 
                    <path d="M228.809,406.44c-29.152,0-52.788,23.644-52.788,52.788c0,29.136,23.637,52.772,52.788,52.772 c29.136,0,52.763-23.636,52.763-52.772C281.572,430.084,257.945,406.44,228.809,406.44z"></path> 
                    </g> 
                </g>
            </svg>
        )

    }
    
    if(type === "warning"){
        return (
           

            <svg viewBox="2 2 20.1 18.5" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="inherit">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.4800000000000001"></g>
                <g id="SVGRepo_iconCarrier"> 
                <path d="M12 15H12.01M12 12V9M4.98207 19H19.0179C20.5615 19 21.5233 17.3256 20.7455 15.9923L13.7276 3.96153C12.9558 2.63852 11.0442 2.63852 10.2724 3.96153L3.25452 15.9923C2.47675 17.3256 3.43849 19 4.98207 19Z" stroke="inherit" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                </path> </g>
            </svg>
        )
    }
    

    if(type === "error"){
        return (
            <svg viewBox="0 0 16 16" fill="inherit" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier"><path d="M7.493 0.015 C 7.442 0.021,7.268 0.039,7.107 0.055 C 5.234 0.242,3.347 1.208,2.071 2.634 C 0.660 4.211,-0.057 6.168,0.009 8.253 C 0.124 11.854,2.599 14.903,6.110 15.771 C 8.169 16.280,10.433 15.917,12.227 14.791 C 14.017 13.666,15.270 11.933,15.771 9.887 C 15.943 9.186,15.983 8.829,15.983 8.000 C 15.983 7.171,15.943 6.814,15.771 6.113 C 14.979 2.878,12.315 0.498,9.000 0.064 C 8.716 0.027,7.683 -0.006,7.493 0.015 M8.853 1.563 C 9.967 1.707,11.010 2.136,11.944 2.834 C 12.273 3.080,12.920 3.727,13.166 4.056 C 13.727 4.807,14.142 5.690,14.330 6.535 C 14.544 7.500,14.544 8.500,14.330 9.465 C 13.916 11.326,12.605 12.978,10.867 13.828 C 10.239 14.135,9.591 14.336,8.880 14.444 C 8.456 14.509,7.544 14.509,7.120 14.444 C 5.172 14.148,3.528 13.085,2.493 11.451 C 2.279 11.114,1.999 10.526,1.859 10.119 C 1.618 9.422,1.514 8.781,1.514 8.000 C 1.514 6.961,1.715 6.075,2.160 5.160 C 2.500 4.462,2.846 3.980,3.413 3.413 C 3.980 2.846,4.462 2.500,5.160 2.160 C 6.313 1.599,7.567 1.397,8.853 1.563 M7.706 4.290 C 7.482 4.363,7.355 4.491,7.293 4.705 C 7.257 4.827,7.253 5.106,7.259 6.816 C 7.267 8.786,7.267 8.787,7.325 8.896 C 7.398 9.033,7.538 9.157,7.671 9.204 C 7.803 9.250,8.197 9.250,8.329 9.204 C 8.462 9.157,8.602 9.033,8.675 8.896 C 8.733 8.787,8.733 8.786,8.741 6.816 C 8.749 4.664,8.749 4.662,8.596 4.481 C 8.472 4.333,8.339 4.284,8.040 4.276 C 7.893 4.272,7.743 4.278,7.706 4.290 M7.786 10.530 C 7.597 10.592,7.410 10.753,7.319 10.932 C 7.249 11.072,7.237 11.325,7.294 11.495 C 7.388 11.780,7.697 12.000,8.000 12.000 C 8.303 12.000,8.612 11.780,8.706 11.495 C 8.763 11.325,8.751 11.072,8.681 10.932 C 8.616 10.804,8.460 10.646,8.333 10.580 C 8.217 10.520,7.904 10.491,7.786 10.530 " stroke="none" fill-rule="evenodd" fill="inherit">
                </path></g></svg>
        )
    }
    

    if(type === "info"){
        return (
            <svg viewBox="11 6 2 12" height='100%' width='100%' fill="inherit" stroke="inherit" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 7.00999L12 7M12 17L12 10" stroke="inherit" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        )
    }
    
}

export function BtTooltip({children, type, color, imageColor, tooltipColor, className, side}) {
    
    const [isVisible, setIsVisible] = React.useState(false)

    return (
        <div className="relative">
            <div className={`
            absolute w-8 h-8 rounded-full p-2 flex justify-center items-center -translate-x-1/2 -translate-y-1/2 hover:scale-[1.15] transition-all
            fill-${getImageColor(imageColor)} stroke-${getImageColor(imageColor)}
            ${getColor(color)} ${className}
            `}
                onMouseEnter={() => {
                    setIsVisible(true)
                }}
                onMouseLeave={() => setIsVisible(false)}
            >
                {getImage(type)}
            </div>
            {isVisible? 
                <div className={`
                    absolute border rounded p-2 text-white text-center transtion-all z-10
                    ${getChildrenSideStyle(side)}
                    ${getTooltipColor(tooltipColor)}
                `}>
                    {children}
                    <div className={`
                        absolute p-2 w-2 h-2 rotate-45  
                        ${getTooltipColor(tooltipColor)}
                        ${getArrowSideStyle(side)}
                    `}></div>
                </div>
                :
             <></>
            }
            
        </div>
        
    );
    
}



