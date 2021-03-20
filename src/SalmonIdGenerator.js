import React, { useEffect, useState, useRef } from 'react'
import "./SalmonIdGenerator.css";

const SalmonIdGenerator = () => {
    const today = new Date();
    const date = {
        date: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear()-1911,
    }

    const days = [...Array(30).keys()].map(x => x+1)
    const months = [...Array(12).keys()].map(x => x+1)
    const years = [...Array(date.year).keys()].map(x => date.year-x)

    const [birthDate, setBirthDate] = useState({
        year: "",
        month: "",
        date: "",
    });
    const [name, setName] = useState("");    
    const [sex, setSex] = useState("");
    const [image, setImage] = useState(null);
    const [face, setFace] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const canvas = useRef(null);
    const deafaultImage = useRef(null);

    useEffect(() => {
        const fake_roc_id = new Image();
        fake_roc_id.src = "https://i.imgur.com/QBlys1A.png";
        fake_roc_id.onload = () => setImage(fake_roc_id);

        const face = new Image();
        face.src = "https://izzycooking.com/wp-content/uploads/2020/10/Salmon-Nigiri-thumbnail-500x500.jpg";
        face.onload = () => setFace(face);
    }, [])

    useEffect(() => {
        if( (image && face) && canvas){
            const ctx = canvas.current.getContext("2d")
            ctx.drawImage(image, 0, 0)
            ctx.drawImage(face, 400, 30, 160, 160*1.285)
            // canvas.style.letterSpacing = 200/name.length + 'px';

            // ctx.fillRect(100,168,230,32)
            ctx.font = "35px PMingLiU"
            ctx.fillStyle = "#3f434a"
            ctx.textAlign = "left"
            ctx.fillText(getSpacedName(name), 100, 195, 230)

            ctx.font = "22px PMingLiU"
            ctx.textAlign = "center"
            ctx.fillText(birthDate.year, 165, 260)
            ctx.fillText(birthDate.month, 227.5, 260)
            ctx.fillText(birthDate.date, 290, 260)
            
            ctx.font = "20px PMingLiU"
            ctx.fillText(sex, 495, 265)

            ctx.font = "17px PMingLiU"
            ctx.fillText(date.year, 145, 314)
            ctx.fillText(date.month, 180, 314)
            ctx.fillText(date.date, 210, 314)

            ctx.font = "100 30px PMingLiU"
            ctx.fillStyle = "#ba2822"
            ctx.textAlign = "left"
            ctx.fillText("A123456789", 403, 325)
        }        
    }, [image, face, canvas, birthDate, name, sex])
    
    const submitHandler = (e) => {
        const name = document.forms["idForm"]["name"].value;
        if (!name.includes("鮭魚")) {
            alert("名字沒鮭魚還想吃鮭魚？回去重寫 😠!");
            return;
        }

        setShowResult(true);
        canvas.current.style.display = "block";
        deafaultImage.current.style.display = "none"
    }

    const getSpacedName = (name) => {
        const maxChar = 25;
        const spaces = (maxChar - name.length)/name.length;
        return name ? name.split('').join(" ".repeat(spaces)) : "";
    }

    const restart = (e) => {
        setShowResult(false);
        canvas.current.style.display = "none";
        deafaultImage.current.style.display = "block"
    }

    return (
        <div className="GeneratorPage">
            <p className="title">🍣 鮭魚身分證產生器 🍣</p>           
            <p className="subtitle">沒有改名的勇氣，也要有裝逼的勇氣😎</p>   
            <img src="https://i.imgur.com/C2nUhcr.png" ref={deafaultImage} className="idCard_default"/>
            <canvas width="588" height="364" ref={canvas} className="idCard" style={{}}/>
            {
                showResult? 
                    <div className="result"> 
                        <p className="end">Wow那你很會取名字喔😎😎😎</p>
                        <p className="saveNote">*電腦按下右鍵可以保存，手機點擊圖片長按即可*</p>
                        <button  className="restartButton" onClick={(e) => restart() }>再玩一次 🍣</button>
                    </div>                   
                    :
                    <form name="idForm" className="formContainer" onSubmit={ e => submitHandler(e)}>
                        <div className="name formRow">
                            <label for="idForm" className="formLabel">姓名</label>
                            <input type="text" name="name" placeholder="必須含有“鮭魚”二字 🍣" value={name} required className="formInput" onChange={ e => setName(e.target.value)}/>
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
                            const new_face = new Image();
                            new_face.src = URL.createObjectURL(e.target.files[0]);
                            new_face.onload = () => setFace(new_face);                        
                        }}/>

                        <input type="submit" value="完成 😎" className="submitButton"/>
                    </form>   
            }            
        </div>        
    )
}

export default SalmonIdGenerator
