import React from 'react';
import "./Board.css";
import { Button, Toolbar, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';

const availableColors = ["green", "red", "yellow", "blue", "pink", "skyblue", "black"];
const defaultCurrentColor = "green";
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
    const [selectedColors, setSelectedColors] = React.useState<any>({});
    const [allHints, setAllHints] = React.useState<any>({});
    const maxWidthMediaQuery = useMediaQuery('(max-width:700px)');

    React.useEffect(() => {
        setSecretCode(getRandomColors(4));
    }, [])

    const handleColorClick = (event: any) => {
        const id = event.target.id;
        if (id.includes("availableColor")) {
            const currentColor = id.split("-")[1];
            setCurrentColor(currentColor);
        }
        else if (id.includes("selectableColor")) {
            setSelectedColors({ ...selectedColors, [id]: currentColor });
        }
    };

    const renderCircle = (id: string, bgColor?: string, customElement?: any) => {
        let animationRequired = false;
        let disabled = true;
        let backgroundColor: any;

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
            backgroundColor = selectedColors[id];
        }
        else if (id.includes("secretColor")) {
            disabled = false;
        }

        return (
            <button
                id={id}
                className="circle"
                disabled={gameOver ? true : disabled}
                style={{
                    backgroundColor: bgColor ? bgColor : (backgroundColor ? backgroundColor : undefined),
                    animation: animationRequired ? circleAnimation : undefined,
                    width: maxWidthMediaQuery ? '35px' : '40px',
                    height: maxWidthMediaQuery ? '35px' : '40px',
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
                <div className="hintCircle" style={{ backgroundColor: allHints[`hint-${currentRowIndex}1`] ? allHints[`hint-${currentRowIndex}1`] : undefined }}></div>
                <div className="hintCircle" style={{ backgroundColor: allHints[`hint-${currentRowIndex}2`] ? allHints[`hint-${currentRowIndex}2`] : undefined }}></div>
                <div className="hintCircle" style={{ backgroundColor: allHints[`hint-${currentRowIndex}3`] ? allHints[`hint-${currentRowIndex}3`] : undefined }}></div>
                <div className="hintCircle" style={{ backgroundColor: allHints[`hint-${currentRowIndex}4`] ? allHints[`hint-${currentRowIndex}4`] : undefined }}></div>
            </div>
        )
    };

    const handleCheckButtonClick = (currentRowIndex: number) => {

        const currentSelectedColors: string[] = [];
        for (let index = 1; index <= 4; index++) {
            const selectedColor = selectedColors[`selectableColor-${currentRowIndex}${index}`];
            if (selectedColor) {
                currentSelectedColors.push(selectedColor);
            }
        }

        if (currentSelectedColors.length === 4) {
            if (currentSelectedColors.length !== [...new Set(currentSelectedColors)].length) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Duplicate colors not allowed',
                })
            }
            else {
                const result = validateCode(secretCode, currentSelectedColors);

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
                let currentHints = { ...allHints };
                if (result.samePosition) {
                    for (let i = 0; i < result.samePosition; i++) {
                        currentHints = { ...currentHints, [`hint-${currentRowIndex}${i + 1}`]: "green" };
                    }
                }
                if (result.differentPosition) {
                    for (let i = result.samePosition; i < result.samePosition + result.differentPosition; i++) {
                        currentHints = { ...currentHints, [`hint-${currentRowIndex}${i + 1}`]: "red" };
                    }
                }
                setAllHints({ ...currentHints });
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

    const resetGame = () => {
        setCurrentColor(defaultCurrentColor);
        setCurrentRowNumber(1);
        setGameOver(false);
        setSecretCode(getRandomColors(4));
        setSelectedColors({});
        setAllHints({});
    };

    return (
        <>
            <Toolbar />
            <Box
                sx={{
                    width: maxWidthMediaQuery ? '100%' : '50%',
                    // height: '100vh',
                    backgroundColor: 'darkgray',
                    margin: 'auto',
                }}
            >
                {/* Reset game actions */}
                <Box
                    sx={{
                        borderBottom: "2px solid black",
                        marginBottom: '5px',
                        textAlign: "center",
                    }}
                >
                    <Button
                        color="error"
                        variant="contained"
                        style={{
                            marginBottom: '5px',
                            padding: '2px 10px'
                        }}
                        onClick={resetGame}
                    >
                        Reset Game
                    </Button>
                </Box>
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
                                    <div style={{ marginRight: "0.5rem" }}>
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
                        <div style={{ marginRight: "0.5rem" }}>
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
