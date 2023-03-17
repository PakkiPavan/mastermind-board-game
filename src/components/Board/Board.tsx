import React from 'react';
import "./Board.css";
import { Button, Toolbar } from '@mui/material';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';

const availableColors = ["green", "red", "yellow", "blue", "pink", "skyblue", "black"];
const defaultCurrentColor = "green";
const defaultCurrentColorId = "availableColor-green-1";
const circleAnimation = "blink 0.3s infinite";

function Board() {
    const [currentColor, setCurrentColor] = React.useState(defaultCurrentColor);
    const [currentRowNumber, setCurrentRowNumber] = React.useState(1);

    React.useEffect(() => {
        addAnimationToFirstColor(true);
    }, [])

    const addAnimationToFirstColor = (state: boolean) => {
        const defaultFocusingColor = document.getElementById(defaultCurrentColorId) as any;
        defaultFocusingColor.style.animation = state ? circleAnimation : undefined;
    };

    const handleColorClick = (event: any) => {
        const id = event.target.id;
        if (id.includes("availableColor")) {
            addAnimationToFirstColor(false);
            const currentColor = id.split("-")[1];
            setCurrentColor(currentColor);
        }
        else if (id.includes("selectableColor")) {
            const currentSelectableElement = document.getElementById(id) as any;
            currentSelectableElement.style.backgroundColor = currentColor;
        }
    };

    const renderCircle = (id: string, bgColor?: string) => {
        let animationRequired = false;
        let disabled = true;

        if (id.includes("availableColor")) {
            disabled = false;
            const focusColor = id.split("-")[1];
            if (currentColor === focusColor) {
                animationRequired = true;
            }
        }
        else if (id.includes("selectableColor")) {
            const selectableColorId = id.split("-");
            const currentRowIndex: any = parseInt(selectableColorId[1]) / 10;
            if (parseInt(currentRowIndex) === currentRowNumber) {
                disabled = false;
            }
        }

        return (
            <button
                id={id}
                className="circle"
                disabled={disabled}
                style={{
                    backgroundColor: bgColor ? bgColor : undefined,
                    animation: animationRequired ? circleAnimation : undefined,
                }}
                onClick={(event: any) => handleColorClick(event)}
            ></button>
        )
    };

    const renderCheckButton = (id: string, currentCheckButtonIndex: number) => {
        let disabled = true;

        if (currentCheckButtonIndex === currentRowNumber) {
            disabled = false;
        }

        return (
            <Button
                id={id}
                className="checkButton"
                variant="contained"
                color="inherit"
                disabled={disabled}
                sx={{
                    backgroundColor: "white",
                    color: "black"
                }}
                onClick={() => handleCheckButtonClick(currentCheckButtonIndex)}
            >
                Check
            </Button>
        )
    };

    const renderHint = (id: string, currentRowIndex: number) => {

        return (
            <Box
                id={id}
                sx={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'white',
                }}
            >

            </Box>
        )
    };

    const handleCheckButtonClick = (currentRowIndex: number) => {
        console.log("handleCheckButtonClick", currentRowIndex);
        const selectedColors: string[] = [];
        for (let index = 1; index <= 4; index++) {
            const selectableColorElement = document.getElementById(`selectableColor-${currentRowIndex}${index}`) as any;
            if (selectableColorElement) {
                const selectedColor = selectableColorElement.style.backgroundColor;
                if (selectedColor) {
                    selectedColors.push(selectedColor);
                }
            }
        }

        if (selectedColors.length === 4) {
            if(selectedColors.length !== [...new Set(selectedColors)].length){
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Duplicate colors not allowed',
                })
            }
            else{
                setCurrentRowNumber(currentRowNumber + 1);
            }
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Select all 4 colors',
            })
        }

    };

    const generateNumbersArray = (length: number) => {
        return Array.from({ length: length }, (_, index) => index + 1);
    };

    return (
        <>
            <Toolbar />
            <Box
                sx={{
                    width: '50%',
                    height: '100vh',
                    backgroundColor: 'darkgray',
                    margin: 'auto',
                }}
            >
                {/* Available Colors */}
                <Box
                    sx={{
                        borderBottom: '2px solid black',
                        marginBottom: '5px',
                        textAlign: 'center'
                    }}
                >
                    {
                        availableColors.map((color: string, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    {renderCircle(`availableColor-${color}-${index + 1}`, color)}
                                </React.Fragment>
                            )
                        })
                    }
                </Box>
                {/* Board to place the colors */}
                <Box>
                    {
                        generateNumbersArray(10).map((_1, index1: number) => {
                            return (
                                <div key={index1} className="selectableRowContainer">
                                    <div style={{ marginRight: "1rem" }}>
                                        {
                                            generateNumbersArray(4).map((_2, index2: number) => {
                                                return (
                                                    <React.Fragment key={index2}>
                                                        {renderCircle(`selectableColor-${index1 + 1}${index2 + 1}`)}
                                                    </React.Fragment>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className='checkButtonContainer'>
                                        {renderCheckButton(`checkButton-${index1 + 1}`, index1 + 1)}
                                    </div>
                                    <div className='hintContainer'>
                                        {renderHint(`checkButton-${index1 + 1}`, index1 + 1)}
                                    </div>
                                </div>
                            )
                        })
                    }
                </Box>
            </Box>
        </>
    );
}

export default Board;
