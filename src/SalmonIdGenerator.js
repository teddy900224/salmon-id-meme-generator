import React, { useEffect, useState, useRef } from 'react'
import "./SalmonIdGenerator.css";
import ReactGA from 'react-ga';

const SalmonIdGenerator = () => {
    //initialize Google Analytics
    useEffect(() => {
        ReactGA.initialize("UA-164144151-1")
        ReactGA.pageview('/')
    },[])

    //date of today
    const today = new Date();
    const date = {
        date: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear()-1911,
    }

    //const arrays for birthdate options
    const days = [...Array(31).keys()].map(x => x+1)
    const months = [...Array(12).keys()].map(x => x+1)
    const years = [...Array(date.year).keys()].map(x => date.year-x)

    //states
    const [birthDate, setBirthDate] = useState({
        year: "",
        month: "",
        date: "",
    });
    const [name, setName] = useState("");    
    const [sex, setSex] = useState("");
    const [cardImage, setCardImage] = useState(null);
    const [headshot, setHeadshot] = useState(null);
    const [showResult, setShowResult] = useState(false);

    //refs
    const canvas = useRef();
    const deafaultCard = useRef();
    const nameInput = useRef();

    //make sure image loads at first render
    useEffect(() => {
        const cardImage = new Image();
        cardImage.src = "https://i.imgur.com/QBlys1A.png";
        cardImage.onload = () => setCardImage(cardImage);

        const head = new Image();
        head.src = "https://i.imgur.com/Mdea5ym.jpg";
        head.onload = () => setHeadshot(head);        
    }, [])

    //
    useEffect(() => {
        if( (cardImage && headshot) && canvas){
            //initialize canvas
            const ctx = canvas.current.getContext("2d")
            ctx.drawImage(cardImage, 0, 0)
            ctx.drawImage(headshot, 400, 30, 160, 160*1.285)

            //name
            ctx.font = "600 35px PMingLiU, 'Noto Serif TC', serif"
            ctx.fillStyle = "#3f434a"
            ctx.textAlign = "left"
            ctx.fillText(getSpacedName(name), 100, 195, 230)

            //birth date
            ctx.font = "600 22px PMingLiU, 'Noto Serif TC', serif"
            ctx.textAlign = "center"
            ctx.fillText(birthDate.year, 165, 260)
            ctx.fillText(birthDate.month, 227.5, 260)
            ctx.fillText(birthDate.date, 290, 260)
            
            //sex
            ctx.font = "600 20px PMingLiU, 'Noto Serif TC', serif"
            ctx.fillText(sex, 495, 265)

            //date of issue (default to date of today)
            ctx.font = "600 17px PMingLiU, 'Noto Serif TC', serif"
            ctx.fillText(date.year, 145, 314)
            ctx.fillText(date.month, 180, 314)
            ctx.fillText(date.date, 210, 314)

            //uniform id (default to "A123456789")
            ctx.font = "300 28px PMingLiU, 'Noto Serif TC', serif"
            ctx.fillStyle = "#ba2822"
            ctx.textAlign = "left"
            ctx.fillText("A123456789", 403, 325)
        }        
    }, [cardImage, headshot, canvas, birthDate, name, sex])
    
    const submitHandler = (e) => {
        e.preventDefault();

        //validate name input
        const name = nameInput.current.value;
        if ( !(name.includes("鮭") && name.includes("魚"))) {
            alert("名字沒鮭魚還想吃鮭魚？回去重寫 😠!");
            //collects GA event usage
            ReactGA.event({
                category: "Form rejeced",
                action: "Form rejected due to name"
            })
            return;
        }

        setShowResult(true);
        canvas.current.style.display = "block";     //hide result 
        deafaultCard.current.style.display = "none"     //hide default card image

        window.scrollTo({top: 0});
        //collects GA event usage
        ReactGA.event({
            category: "Submit",
            action: "A new salmon meme id generated"
        })
    }

    //adds space between characters in name to look more valid XD
    const getSpacedName = (name) => {
        const maxChar = 25;
        const spaces = (maxChar - name.length)/name.length;
        return name ? name.split('').join(" ".repeat(spaces)) : "";
    }

    //restart the app by hiding result, and show the forms & default image again.
    const restart = (e) => {
        setShowResult(false);
        canvas.current.style.display = "none";  //hide result 
        deafaultCard.current.style.display = "block";   //show deafult card image
       
        setName("");
        //reset headshot to default image(sushi)
        const headshot = new Image();
        headshot.src = "https://i.imgur.com/Mdea5ym.jpg";
        headshot.onload = () => setHeadshot(headshot);  
        setHeadshot(); 
        
        window.scrollTo({top: 0});        
        //collects GA event usage
        ReactGA.event({
            category: "Restart",
            action: "A user restarted the game"
        })
    }

    return (
        <div className="GeneratorPage">
            <p className="title">🍣 鮭魚身分證產生器 🍣</p>           
            <p className="subtitle">沒有改名的勇氣，也要有裝逼的勇氣😎</p>   
            <img src="https://i.imgur.com/C2nUhcr.png" ref={deafaultCard} className="idCard_default"/>
            <canvas width="588" height="364" ref={canvas} className="idCard" style={{}}/>
            {
                showResult? 
                    <div className="result"> 
                        <p className="end">Wow那你很會取名字喔😎😎😎</p>
                        <p className="saveNote">*電腦按下右鍵可以保存，手機直接螢幕截圖*</p>
                        <button  className="restartButton" onClick={(e) => restart() }>再玩一次 🍣</button>  
                    </div>                   
                    :
                    <form className="formContainer" autocomplete="off" onSubmit={ e => submitHandler(e)}>
                        <div className="name formRow">
                            <label for="idForm" className="formLabel">姓名</label>
                            <input type="text" ref={nameInput} placeholder="必須含有“鮭魚”二字 🍣" value={name} required className="formInput" onChange={ e => setName(e.target.value)}/>
                        </div>                

                        <div className="birthDate formRow">
                            <label for="idForm" className="formLabel">出生年/月/日</label>
                            <select name="birthYear" for="idForm" required className="formInput" onChange={ e => setBirthDate({
                                ...birthDate,
                                year: e.target.value
                            })}>
                                <option></option>
                                {years.map( year => <option>{year}</option>) }       
                            </select>                 
                            <select name="birthMonth" for="idForm" required className="formInput" onChange={ e => setBirthDate({
                                ...birthDate,
                                month: e.target.value
                            })}>                   
                                <option></option>
                                { months.map( month => <option>{month}</option>) }                
                            </select> 
                            <select name="birthDate" for="idForm" required className="formInput" onChange={ e => setBirthDate({
                                ...birthDate,
                                date: e.target.value
                            })}>
                                <option></option>
                                    { days.map( day => <option>{day}</option>) }
                            </select> 
                        </div>                

                        <div className="sex formRow">
                            <label for="idForm" className="formLabel">性別</label>
                            <select name="sex" for="idForm" required className="formInput" onChange={ e => setSex(e.target.value)}> 
                                <option></option>
                                <option>男</option>
                                <option>女</option>
                                <option>鮭魚</option>
                            </select> 
                        </div>                 
                        
                        <label for="idForm" className="formLabel formRow">上傳大頭照（選填）</label>
                        <input type="file" accept="image/*" onChange={ e => {
                            const new_headshot = new Image();
                            new_headshot.src = URL.createObjectURL(e.target.files[0]);
                            new_headshot.onload = () => setHeadshot(new_headshot);
                            ReactGA.event({
                                category: "Upload",
                                action: "A user uploaded an image"
                            })                        
                        }}/>

                        <button type="submit" className="submitButton">完成 😎</button>
                    </form>   
            }       
            <div className="shareContainer">
                <p className="shareMessage">覺得有趣的話分享出去吧🤪 ～</p>
                <div class="fb-share-button" 
                    className="fb-share-button"
                    data-href="https://salmon-id-generator.netlify.app/" 
                    data-layout="button_count">
                </div>  
            </div>       
            <a className="hashtag" target="_blank" href="https://www.instagram.com/explore/tags/鮭魚身分證產生器/">#鮭魚身分證產生器</a>      
        </div>        
    )
}

export default SalmonIdGenerator