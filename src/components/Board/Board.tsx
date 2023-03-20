import React from 'react';
import "./Board.css";
import { Button, Toolbar } from '@mui/material';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';

const availableColors = ["green", "red", "yellow", "blue", "pink", "skyblue", "black"];
const defaultCurrentColor = "green";
const defaultCurrentColorId = "availableColor-green-1";
const circleAnimation = "blink 0.3s infinite";

const getRandomColors = (numOfColors: number) => {
    const result: string[] = [];
    while (result.length < numOfColors) {
        const randomIndex = Math.floor(Math.random() * availableColors.length);
        const randomColor = availableColors[randomIndex];
        if (!result.includes(randomColor)) {
            result.push(randomColor);
        }
    }
    return result;
}

function Board() {
    const [currentColor, setCurrentColor] = React.useState(defaultCurrentColor);
    const [currentRowNumber, setCurrentRowNumber] = React.useState(1);
    const [secretCode, setSecretCode] = React.useState<string[]>([]);
    const [gameOver, setGameOver] = React.useState<boolean>(false);

    React.useEffect(() => {
        addAnimationToFirstColor(true);
        setSecretCode(getRandomColors(4));
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

    const renderCircle = (id: string, bgColor?: string, customElement?: any) => {
        let animationRequired = false;
        let disabled = true;

        if (id.includes("availableColor")) {
            disabled = false;
            const focusColor = id.split("-")[1];
            if (!gameOver && currentColor === focusColor) {
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
        else if(id.includes("secretColor")){
            disabled = false;
        }

        return (
            <button
                id={id}
                className="circle"
                disabled={gameOver ? true : disabled}
                style={{
                    backgroundColor: bgColor ? bgColor : undefined,
                    animation: animationRequired ? circleAnimation : undefined,
                }}
                onClick={(event: any) => handleColorClick(event)}
            >{customElement}</button>
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
                disabled={gameOver ? true : disabled}
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
            <div
                className="hints"
                id={`hints-${currentRowIndex}`}
            >
                <div className="hintCircle"></div>
                <div className="hintCircle"></div>
                <div className="hintCircle"></div>
                <div className="hintCircle"></div>
            </div>
        )
    };

    const handleCheckButtonClick = (currentRowIndex: number) => {

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
            if (selectedColors.length !== [...new Set(selectedColors)].length) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Duplicate colors not allowed',
                })
            }
            else {
                console.log("secretCode", secretCode);
                console.log("selectedCode", selectedColors);
                const result = validateCode(secretCode, selectedColors);

                if (result.samePosition === 4) {
                    setGameOver(true);
                    Swal.fire({
                        icon: 'success',
                        title: 'You Won',
                        text: 'Congratulations!! You won the game',
                    })
                    return;
                }
                else {
                    setCurrentRowNumber(currentRowNumber + 1);
                }
                const hintElement = document.getElementById(`hints-${currentRowIndex}`) as any;
                const child = hintElement.children;
                if (result.samePosition) {
                    for (let i = 0; i < result.samePosition; i++) {
                        child[i].style.backgroundColor = "green";
                    }
                }
                if (result.differentPosition) {
                    for (let i = result.samePosition; i < result.samePosition + result.differentPosition; i++) {
                        child[i].style.backgroundColor = "red";
                    }
                }
            }
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Select all 4 colors',
            })
        }
        if (currentRowIndex === 10) {
            setGameOver(true);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'You lost the game',
            })
        }

    };

    const generateNumbersArray = (length: number) => {
        return Array.from({ length: length }, (_, index) => index + 1);
    };

    const validateCode = (secretCode: string[], selectedCode: string[]) => {
        let samePosition = 0;
        let differentPosition = 0;
        for (let i = 0; i < secretCode.length; i++) {
            if (secretCode[i] === selectedCode[i]) {
                samePosition++;
            }
            else if (secretCode.includes(selectedCode[i])) {
                differentPosition++;
            }
        }
        return {
            samePosition,
            differentPosition
        }
    };

    return (
        <>
            <Toolbar />
            <Box
                sx={{
                    width: '50%',
                    // height: '100vh',
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
                        generateNumbersArray(3).map((_1, index1: number) => {
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
                                        {renderHint(`hint-${index1 + 1}`, index1 + 1)}
                                    </div>
                                </div>
                            )
                        })
                    }
                </Box>
                {/* Secret Code */}
                <Box
                    sx={{
                        borderTop: '2px solid black',
                        textAlign: 'center'
                    }}
                >
                    <div className="selectableRowContainer">
                        <div style={{ marginRight: "1rem" }}>
                            {
                                secretCode.map((color: string, index: number) => {
                                    return (
                                        <React.Fragment key={index}>
                                            {
                                                gameOver ?
                                                renderCircle(`secretColor-${color}-${index + 1}`, color) :
                                                renderCircle(`secretColor-${color}-${index + 1}`, undefined, "?")
                                            }
                                        </React.Fragment>
                                    )
                                })
                            }
                        </div>
                        <div className='checkButtonContainer' style={{ visibility: 'hidden' }}>
                            {renderCheckButton(`checkButton-11`, 11)}
                        </div>
                        <div className='hintContainer' style={{ visibility: 'hidden' }}>
                            {renderHint(`hint-11`, 11)}
                        </div>
                    </div>
                </Box>
            </Box>
        </>
    );
}

export default Board;
