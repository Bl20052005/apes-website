import "./App.css";
import React, {useState} from 'react';

function Score({score}) {
    return(
        <div id="score">
            <p>Score: {score[0]}/{score[1]}</p>
        </div>
    )
}

function Images({images, id}) {

    const showInformation = () => {
        let curInfo = document.getElementById("image-expanded-container-" + id);
        let isOpen = curInfo.dataset.open;
        if(isOpen === "closed") {
            curInfo.dataset.open = "open";
            curInfo.style.visibility = "visible";
            curInfo.style.opacity = "1";
            curInfo.style.height = "180px";
            document.getElementById("image-expanded-" + id).style.height = "180px";
        } else if(isOpen === "open") {
            curInfo.dataset.open = "closed";
            curInfo.style = "";
            document.getElementById("image-expanded-" + id).style = "";
        }
    }

    return(
        <div className="outer-circle" onClick={() => showInformation()}>
            <img className="inner-image" src={images}/>
        </div>
    );
}

function ImageExpandedDescription({isQuiz, curDescription, id, quizMaterial, setQuizMaterial, score, setScore}) {

    const evaluateQuiz = (currentId, correctId) => {
        if(currentId == correctId) {
            if(score[0] === "-" && score[1] === "-") {
                setScore([1, 1]);
            } else {
                setScore([score[0] + 1, score[1] + 1]);
            }
            let final = ["transparent", "transparent", "transparent", "transparent"];
            final[parseInt(currentId) - 1] = "rgb(36, 165, 53)";
            setQuizMaterial([quizMaterial[0], true, ...quizMaterial.slice(2,3), final, ["Correct!", "visible", "1", "rgb(36, 165, 53)", false]]);
        } else {
            if(score[0] === "-" && score[1] === "-") {
                setScore([0, 1]);
            } else {
                setScore([score[0], score[1] + 1]);
            }
            let final = ["transparent", "transparent", "transparent", "transparent"];
            final[parseInt(correctId) - 1] = "rgb(36, 165, 53)";
            final[parseInt(currentId) - 1] = "#f55547";
            setQuizMaterial([quizMaterial[0], true, ...quizMaterial.slice(2,3), final, ["Incorrect.", "visible", "1", "#f55547", false]]);
        }
    }
    if(isQuiz) {
        return (
            <div className="quiz image-expanded-description">
                <p hidden={quizMaterial[4][4]} className="quiz-final" style={{"visibility" : quizMaterial[4][1], "opacity" : quizMaterial[4][2], "color" : quizMaterial[4][3]}}>{quizMaterial[4][0]}</p>
                <p className="quiz-title">{curDescription[0]}</p>
                <div className="quiz-body" onChange={(e) => {
                    let final = [false, false, false, false];
                    final[parseInt(e.target.id.substring(e.target.id.length-1)) - 1] = true;
                    setQuizMaterial([[e.target.value, e.target.id.substring(e.target.id.length-1)], quizMaterial[1], final, ...quizMaterial.slice(3)]);
                }}>
                    <div id={"quiz-answer-container-" + id + "-1"} className={"quiz-answer-container"} style={{"backgroundColor" : quizMaterial[3][0]}}>
                        <input type="radio" id={"quiz-answer-" + id + "-1"} name={"quiz-answer-" + id + "answer"} value={curDescription[1]} defaultChecked={quizMaterial[2][0]} disabled={quizMaterial[1]}/>
                        <label htmlFor={"quiz-answer-" + id + "-1"}>{curDescription[1]}</label><br/>
                    </div>
                    <div id={"quiz-answer-container-" + id + "-2"} className={"quiz-answer-container"} style={{"backgroundColor" : quizMaterial[3][1]}}>
                        <input type="radio" id={"quiz-answer-" + id + "-2"} name={"quiz-answer-" + id + "answer"} value={curDescription[2]} defaultChecked={quizMaterial[2][1]} disabled={quizMaterial[1]} />
                        <label htmlFor={"quiz-answer-" + id + "-2"}>{curDescription[2]}</label><br/>
                    </div>
                    <div id={"quiz-answer-container-" + id + "-3"} className={"quiz-answer-container"} style={{"backgroundColor" : quizMaterial[3][2]}}>
                        <input type="radio" id={"quiz-answer-" + id + "-3"} name={"quiz-answer-" + id + "answer"} value={curDescription[3]} defaultChecked={quizMaterial[2][2]} disabled={quizMaterial[1]} />
                        <label htmlFor={"quiz-answer-" + id + "-3"}>{curDescription[3]}</label><br/>
                    </div>
                    <div id={"quiz-answer-container-" + id + "-4"} className={"quiz-answer-container"} style={{"backgroundColor" : quizMaterial[3][3]}}>
                        <input type="radio" id={"quiz-answer-" + id + "-4"} name={"quiz-answer-" + id + "answer"} value={curDescription[4]} defaultChecked={quizMaterial[2][3]} disabled={quizMaterial[1]} />
                        <label htmlFor={"quiz-answer-" + id + "-4"}>{curDescription[4]}</label><br/>
                    </div>
                    <button className="quiz-submit-button" onClick={() => evaluateQuiz(quizMaterial[0][1], curDescription[5][1])}>Submit</button>
                </div>       
            </div>
        )
    } else {
        return(
            <p className="image-expanded-description">{curDescription}</p>
        );
    }
}

function ImageExpanded({images, text, addedClass, id, title, expandedText, score, setScore, navs}) {
    const [fullscreen, setFullscreen] = useState(false);
    const [styling, setStyling] = useState([{}, {}]);
    const [isOpen, setIsOpen] = useState("closed");
    const [curTitle, setCurTitle] = useState(title[0]);
    const [curDescription, setCurDescription] = useState(expandedText[0]);
    const [isQuiz, setIsQuiz] = useState(false);
    const [quizMaterial, setQuizMaterial] = useState(
        [[expandedText[2][1], "1"], //what is the current id of the radio button selected
        false, //is the entire quiz finished / disabled
        [true, false, false ,false], //what should the quiz reload as defaultChecked next time?
        ["transparent", "transparent", "transparent", "transparent"], //what's the colors of the answer choices?
        ["", "hidden", "0", "", true] //the message that displays when quiz is checked (correct or incorrect)
        ]);

    const changeToFull = () => {
        setFullscreen(true);
        setStyling([{}, {"height" : "95px", "transition" : "none 0s ease 0s"}]);
    }

    const changeFromFull = () => {
        setFullscreen(false);
        setCurTitle(title[0]);
        setCurDescription(expandedText[0]);
        setIsQuiz(false);
        setIsOpen("open");
        setStyling([{"height" : "180px", "transition" : "none"}, {"height" : "180px", "transition" : "none 0s ease 0s"}]);
    }

    const changeText = (option) => {
        switch(option) {
            case 1:
                setCurTitle(title[0]);
                setCurDescription(expandedText[0]);
                setIsQuiz(false);
                break;
            case 2:
                setCurTitle(title[1]);
                setCurDescription(expandedText[1]);
                setIsQuiz(false);
                break;
            case 3:
                setCurTitle(title[2]);
                setCurDescription(expandedText[2]);
                setIsQuiz(true);
                break;
        }
    }

    if(fullscreen) {
        return(
            <div style={{"height" : "0", "width": "0"}}>
                <div className={"image-expanded-container-expanded"} id={"image-expanded-container-expanded" + id}>
                    <div className="navbar">
                        <div className="navbar-1" onClick={() => changeText(1)}>{navs[0]}</div>
                        <div className="navbar-2" onClick={() => changeText(2)}>{navs[1]}</div>
                        <div className="navbar-3" onClick={() => changeText(3)}>{navs[2]}</div>
                    </div>
                    <img src="https://static.thenounproject.com/png/1268891-200.png" alt="expand" className="shrink-icon" onClick={() => changeFromFull()}/>
                    <img className="image-text-image expanded-image" src={images}/>
                    <div className="image-expanded-line"></div>
                    <h1 className="image-title">{curTitle}</h1>
                    <ImageExpandedDescription isQuiz={isQuiz} curDescription={curDescription} id={id} quizMaterial={quizMaterial} setQuizMaterial={setQuizMaterial} score={score}  setScore={setScore}/>
                </div>
            </div>
        );
    } else {
        return(
            <div className={"image-expanded-container " + addedClass} data-open={isOpen} id={"image-expanded-container-" + id} style={styling[0]}>
                <img src="https://cdn-icons-png.flaticon.com/512/151/151926.png" alt="expand" className="expand-icon" onClick={() => changeToFull()}/>
                <div className={"image-expanded"} id={"image-expanded-" + id} style={styling[1]}>
                    <img className="image-text-image" src={images}/>
                    <p className="image-text">{text}</p>
                </div>
                <div className="image-expanded-triangle"></div>
            </div>
            
        );
    }
}

function ImageContainer({images, text, id, title, expandedText, score, setScore, navs}) {
    return(
        <div className="image-container" id={"image-container-" + id}>
            <Images images={images} id={id}/>
            <ImageExpanded images={images} text={text} addedClass={id % 2 === 1 ? "odd" : "even"} id={id} title={title} expandedText={expandedText} score={score}  setScore={setScore} navs={navs}/>
        </div>
    );
}

function Options({images, text, title, expandedText, score, setScore}) {
    return(
        <div id="options">
            <div id="line"></div>
            <ImageContainer images={images[0]} text={text[0]} id={1} title={title[0]} expandedText={expandedText[0]} score={score} setScore={setScore} navs={title[5]}/>
            <ImageContainer images={images[1]} text={text[1]} id={2} title={title[1]} expandedText={expandedText[1]} score={score} setScore={setScore} navs={title[5]}/>
            <ImageContainer images={images[2]} text={text[2]} id={3} title={title[2]} expandedText={expandedText[2]} score={score} setScore={setScore} navs={title[5]}/>
            <ImageContainer images={images[3]} text={text[3]} id={4} title={title[3]} expandedText={expandedText[3]} score={score} setScore={setScore} navs={title[5]}/>
            <ImageContainer images={images[4]} text={text[4]} id={5} title={title[4]} expandedText={expandedText[4]} score={score} setScore={setScore} navs={title[5]}/>
        </div>
    );
}

function Dropdown({setScore, setImages, setText, setTitle, setExpandedText}) {

    const resetAll = () => {
        setScore(["-", "-"]);
        setImages([
            "https://www.priyamstudycentre.com/wp-content/uploads/2022/12/Non-renewable-energy-resources-crude-oil-coal-natural-gas-and-nuclear-fuel.png",
            "https://static.seekingalpha.com/cdn/s3/uploads/getty_images/1185308131/image_1185308131.jpg?io=getty-c-crop-4-3",
            "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2022/03/crude_oil_investing.jpeg.jpg",
            "https://whyy.org/wp-content/uploads/2019/10/bigstock-The-gas-is-burning-the-gas-st-307682305.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/2/24/2011-05-10_18-57-46_Switzerland_-_Wil_crop.jpg"
        ]);
        setText(["So, what exactly is non-renewable energy? Expand to learn more!", "Coal: the energy that came from plants millions of years ago, expand to learn more!", "Oil: the energy that runs the world, expand to learn more!", "Natural gas: a cleaner burning fuel? Expand to learn more!", "Nuclear: a better alternative? Expand to learn more!"]);
        setTitle([["What is non-renewable energy?", "What are the effects of non-renewable energy?", "Quiz!"], 
        ["What is coal?", "What are the effects of coal?", "Quiz!"], 
        ["What is oil?", "What are the effects of oil?", "Quiz!"],
        ["What is natural gas?", "What are the effects of natural gas?", "Quiz!"],
        ["What is nuclear energy?", "What are the effects of nuclear power?", "Quiz!"],
        ["Description", "Effects", "Quiz"]]);
        setExpandedText([["Non-renewable energy is most commonly associated with fossil fuels, but it also includes nuclear energy. It is \"non-renewable\" because the energy sources were built up from millions and billions of years of progress; far slower than our speed of usage.",
        "Non-renewables are mostly not sustainable in the long run. They often produce harmful byproducts and contribute to harmful pollution with detrimental effects on human health.",
        ["Why is non-renewable energy \"non-renewable\"?", "Because it is energy from the Sun", "Because it uses living organisms as a power sources", "Because we use it far too quickly for it to replenish back", "Because we use it far too slowly to completely exhaust it", ["Because we use it far too quickly for it to replenish back", 3]]],
        
        ["Coal comes from dead plants from millions of years ago, and it is one of the most common non-renewable sources of energy currently used. There are three main types of coal: anthracite, lignite, and bituminous coal. Despite its non-renewable status and toxic aftereffects, it is used to generate almost 30% of global energy today.",
        "Coal releases carbon dioxide, which contributes to climate change and global warming. It also releases neurotoxins such as lead and mercury that can disrupt communications with the brain and body, causing paralysis and often organ failures.",
        ["Which of these is not a type of coal?", "Lignite", "Anthracite", "Bituminous", "Andesite", ["Andesite", 4]]],
        
        ["Oil comes from dead animals from millions of years ago, and in addition to being a substantial energy source, it is also used to make many products we use in our everyday lives like plastic. Oil is extracted using drills and pumps both onland and offshore, and it accounts for around 30% of the world's energy use.",
        "Oil, like coal, also produces carbon dioxide as well as amounts of nitrogen and sulfur oxides. It also produces particulates, which can cause lung cancer and other respiratory complications.",
        ["What % of the world's energy comes from oil?", "~40%", "~30%", "~20%", "~10%", ["~30%", 2]]],
        
        ["Natural gas accounts for around 20% of the world's energy sources. It is obtained by fracking, a process similar to drilling except that water, sand, and other chemicals are pressurized down a tube to break up rock formation, allowing natural gas to escape. The largest component in natural gas is methane gas (CH4)",
        "Natural gas releases carbon dioxide, but otherwise does not release significant toxic compounds, effectively making them cleaner than coal and oil. However, the fracking process itself can have unintended consequences as the methane in natural gas can escape into the atmosphere, becoming greenhouse gasses, and fracking can also increase the chance for earthquakes",
        ["What is fracking?", "pressurizing sand, water, and chemicals underground to extract natural gas", "drilling underwater using a commercial drill to extract natural gas", "Digging up soil to form a deep hole to extract natural gas", "Using a hammer to detect where natural gas deposits may be", ["pressurizing sand, water, and chemicals underground to extract natural gas", 1]]],
        
        ["Nuclear energy is extracted from Uranium using controlled fission reactions. Using free neutrons, an uranium atom can be split into two, releasing more neutrons to split even more uranium atoms. This process releases an incredible amount of energy from little material and although non-renewable, it has a huge amount of potential.",
        "Nuclear energy releases no toxic gasses, no carbon dioxide, and no neurotoxins. However, it does release radioactive waste, which if not properly contained can cause disastrous consequences on human health such as cancer. Radioactive waste must be properly stored and buried for tens of thousands of years.",
        ["What reaction does nuclear energy use?", "fracking", "fusion", "fission", "forex", ["fission", 3]]]
        ]);
    }

    return(
        <div onClick={() => resetAll()}>
            <p>Move onto next module?</p>
        </div>
    );
    
}

function App() {
    const[score, setScore] = useState(["-", "-"]);
    const[images, setImages] = useState(["https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg/800px-Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg"
    , "https://www.treehugger.com/thmb/lWRuacUx4-nSX4Xv3ohWaoPJdUw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/kelpsunburst7feb8-20-1285194406-b8b9a51b0dae4900b7103793180f2c68.jpg",
    "https://i.natgeofe.com/n/d326d61d-8ef6-4f4c-a03f-ab8fbbb40e6d/coral-reefs-2728211_4x3.jpg",
    "https://files.worldwildlife.org/wwfcmsprod/images/African_Elephant_Kenya_112367/story_full_width/qxyqxqjtu_WW187785.jpg",
"https://optimise2.assets-servd.host/maniacal-finch/production/animals/amur-tiger-01-01.jpg?w=1200&auto=compress%2Cformat&fit=crop&dm=1658935145&s=1b96c26544a1ee414f976c17b18f2811"]);
    const[text, setText] = useState(["Otters: aquatic species key to our ecosystem, expand to learn more!", "Kelp forests: vast marine forests that are home to many species, expand to learn more!", "Coral reefs: giant thriving ecosystems with vibrant colors, expand to learn more!", "Elephants: giant land mammals that create habitats and ecosystems, expand to learn more!", "Tigers: apex predators and relatives to housecats, expand to learn more!"]);
    const [title, setTitle] = useState([["What are otters?", "Where do otters live?", "Quiz!"], 
    ["What are kelp forests?", "Where do kelp forests thrive?", "Quiz!"], 
    ["What are coral reefs?", "Where do coral reefs thrive?", "Quiz!"],
    ["What are elephants?", "Where do elephants live?", "Quiz!"],
    ["What are tigers?", "Where do tigers live?", "Quiz!"],
    ["Description", "Habitat", "Quiz"]]);
    const [expandedText, setExpandedText] = useState([["Otters are a member of the weasel family, with all of their species being aquatic or semi-aquatic. They are both strong and fast swimmers, being very mobile in the water! Being a keystone species and a top predator, they control and eat populations of urchins to keep a balanced ecosystem!",
    "Otters can be found in both fresh and saltwater areas such as rivers, lakes, ponds, and marshes. They are very adaptable and can stand a wide variety of weather conditions.",
    ["What populations do otters control?", "Shrimp", "Urchin", "Tuna", "Eels", ["Urchin", 2]]],
    
    ["Kelp forests are areas where kelp thrive, they anchor to the ocean floor and stretch tall into the open waters. They are key in the survival of many species as they are home and food to many that live among them. They also grow quickly, sometimes as much as 12 inches a day!",
    "Kelp forests are located around various coastlines around the Americas, Asia, Europe, Africa, and Australia. They thrive in temperate and arctic environments with nutrient-rich waters.",
    ["Where are kelp forests located?", "Freshwater ponds", "Deep ocean", "Coastlines", "Mountaintops", ["Coastlines", 3]]],
    
    ["Coral reefs are huge ecosystems that are characterized by coral, which are organisms that build hard shells using Calcium Carbonate. Corals also thrive together with algae, which they invite to produce food and give them their distinct bright colors! They are incredibly biodiverse, so much so that they’re often referred to as the \"rainforests of the sea\".",
    "Coral reefs are found in tropical and subtropical waters, mostly within the Tropics of Cancer and Capricorn. They're particularly diverse in the pacific oceans and in Australia, Indonesia, and the Carribeans.",
    ["What are the hard shells of coral reefs made from?", "Calcium Carbonate", "Carbon Dioxide", "Sulfur Tetrachloride", "Magnesium Carbonate", ["Calcium Carbonate", 1]]],
    
    ["Elephants are the largest land mammals on Earth and are distinct in appearance with large ears and a long trunk. Because of their enormous size, elephants are keystone species in their environment as they pave progress for other species and modify habitats in a way unique to them. They also grow tusks, which are extended teeth that are used to obtain food, defend themselves, and even dig holes!",
    "Elephants are found only in Africa and Asia, with them found most often in sub-saharan savannas and grasslands as well as the forests of Thailand, Vietnam, and India.",
    ["Which two continents are elephants found in?", "North America and Europe", "Africa and South America", "Australia and Asia", "Africa and Asia", ["Africa and Asia", 4]]],
    
    ["Tigers are the largest wild cat in the world! They are distinctive in appearance with stripes on their back and weigh an average of 450 pounds. They are an apex predator, hunting alone for deer and antelopes to eat and can take days to finish their meals. A female tiger can raise three to four cubs at a time and will take care of them for a year and a half! They are also agile in the water, and can swim very well.",
    "Tigers are native only to Asia, with over 70% of them living in India alone. They are often associated with tropical forests and lush grasslands, but a species also lives in the cold frigid depths of Siberia!",
    ["How long do tiger moms raise their cubs?", "6 months", "2 and a half years", "1 and a half years", "10 years", ["1 and a half years", 3]]]
    ]);

    return(
        <div id="app">
            <h1 id="title">APES Material</h1>
            <h2 id="title">Module 1: Biodiversity</h2>
            <Score score={score} />
            <Options images={images} text={text} title={title} expandedText={expandedText} score={score} setScore={setScore}/>
            <Dropdown setScore={setScore} setImages={setImages} setText={setText} setTitle={setTitle} setExpandedText={setExpandedText}/>
        </div>
    );
}

export default App;