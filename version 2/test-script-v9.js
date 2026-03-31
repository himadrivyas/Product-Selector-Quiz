const quizData = {
    "meta": {
        "version": "1.9",
        "currency": "USD",
        "company": "SonderCare"
    },
    "questions": [
        {
            "id": "q1",
            "type": "single select",
            "section-number": "1",
            "section-text": "Size & Style",
            "question": "Which bed width is preferred?",
            "required": "true",
            "image": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-1.png",
            "qinfo": "Basic hospital beds are 36\" wide. The 39\" SonderCare standard width is great for users who are comfortable in smaller sleeping areas, don't move a lot during sleep, or who have smaller rooms. The 48\" width is ideal for larger users, anyone who tends to move through the night or is accustomed to larger bed sizes.Aura™ Companion bed (78\") serves perfectly as a generous king-size hospital bed for individual use or converts into a split-king setup—ideal for couples with distinct care needs who still wish to sleep side by side.",
            "options": [
                {
                    "id": "39",
                    "label": "39\" Twin XL",
                    "size": "39"
                },
                {
                    "id": "48",
                    "label": "48\" Wide",
                    "size": "48"
                },
                {
                    "id": "78",
                    "label": "78\" Split King",
                    "size": "78(King)"
                }
            ],
            "option-desc": ""
        },
        {
            "id": "q2-bed",
            "type": "single select",
            "section-number": "1",
            "section-text": "Size & Style",
            "question": "Which finish do you prefer?",
            "showIf": "No-KingBed-selected",
            "image": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-2-A.png",
            "qinfo": "Choose Standard Espresso woodgrain or upgraded Slate Gray fabric (fluid-proof, stain and odor-resistant). Both finishes look warm and inviting. Select the option that best suits the user and the room décor.",
            "options": [
                {
                    "id": "premium",
                    "label": "Woodgrain",
                    "SelectedBed": "Aura Premium",
                    "price": [
                        {
                            "Premium-39": "6,999"
                        },
                        {
                            "Premium-48": "8,999"
                        }
                    ]
                },
                {
                    "id": "platinum",
                    "label": "Upholstered",
                    "SelectedBed": "Aura Platinum",
                    "price": [
                        {
                            "Platinum-39": "8,499"
                        },
                        {
                            "Platinum-48": "10,999"
                        }
                    ]
                }
            ]

        },
        {
            "id": "q2-headboard",
            "type": "single select",
            "section-number": "1",
            "section-text": "Size & Style",
            "question": "Which finish do you prefer?",
            "showIf": "KingBed-selected",
            "image": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-2-B.png",
            "qinfo": "Full-width upholstered headboard is available in choice of two luxurious styles: rectangular Graphite Gray with clean, square tufting or arched Silverstone with nailhead finish.",
            "options": [
                {
                    "id": "grey-headboard",
                    "label": "Graphite gray",
                    "price": "12,999"
                },
                {
                    "id": "offwhite-headboard",
                    "label": "Silverstone",
                    "price": "12,999"
                }
            ]

        },
        {
            "id": "q3",
            "type": "single select",
            "section-number": "1",
            "section-text": "Size & Style",
            "question": "How tall is the user?",
            "image": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-3.png",
            "qinfo": "Taller individuals may want to consider a Length Extension Kit. It is highly recommended for users 6'2\" and taller.",
            "options": [
                {
                    "id": "extensionkit-no",
                    "label": "Less than 6'2\""
                },
                {
                    "id": "extensionkit-yes",
                    "label": "6'2\" or taller"
                }
            ]
        },
        {
            "id": "q4",
            "type": "single select",
            "section-number": "2",
            "section-text": "User Details",
            "question": "Is the user at the risk of falling?",
            "image": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-4.png",
            "qinfo": "For high fall-risk individuals, we often recommend using additional safety measures like an automatic underbed light and, in certain conditions, extra rails.",
            "options": [
                {
                    "id": "safety-acc-no",
                    "label": "Limited risk"
                },
                {
                    "id": "safety-acc-yes",
                    "label": "Mid/High risk"
                }
            ]
        },
        {
            "id": "q5",
            "type": "single select",
            "section-number": "2",
            "section-text": "User Details",
            "question": "Which mattress do you prefer?",
            "qinfo": "Choose from our wide variety of pressure reducing mattresses to cater your specific needs:<ul><li><b>Comfort</b> — Standard Pressure Redistribution Mattress designed for basic comfort and contouring. Visco Memory Foam Top Layer allows immersion into the foam. Ideal for users that typically require assistance to move and reposition in bed and during transfers. </li><li><b>Dream</b> — Premium Pressure Redistribution Mattress designed for customized comfort and support. Bamboo Quilt Top for Easier Repositioning. Reversible with Soft & Firm Sides. Ideal for users that want the clinical benefits of pressure reduction and the feel of a luxury home-style mattress.</li><li><b>Signature Hybrid</b> — Individual pocket coil mattress with orthopedic foam to adjust to body movement and provide ultimate support and relief. Copper-infused cover. Reversible with Soft & Firm sides. Ideal for users who want the best combination of comfort and support that only a hybrid foam and inner spring mattress can provide.</li><li><b>Air</b> — Alternating Pressure / Low-Air-Loss mattress is designed to effectively treat wounds and pressure sores, not as a comfort mattress. Ideal for users at high risk of developing wounds, bed sores, pressure ulcers. Speak with a medical professional prior to using this mattress.</li></ul>",
            "image": [
                {
                    "showIf": "bed size is 39 or 78",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-5-all-4-1-1.png"
                },
                {
                    "showIf": "bed size 48",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-5-no-comfort-1.png"
                }
            ],
            "options": [
                {
                    "id": "comfort-mattress",
                    "label": "Comfort",
                    "showUpFor": [
                        {
                            "bedSize": "39",
                            "price": "899"
                        },
                        {
                            "bedSize": "78",
                            "price": "1,799"
                        }
                    ]
                },
                {
                    "id": "dream-mattress",
                    "label": "Dream",
                    "showUpFor": [
                        {
                            "bedSize": "39",
                            "price": "1,299"
                        },
                        {
                            "bedSize": "48",
                            "price": "1,499"
                        },
                        {
                            "bedSize": "78",
                            "price": "2,599"
                        }
                    ]
                },
                {
                    "id": "hybrid-mattress",
                    "label": "Signature Hybrid",
                    "showUpFor": [
                        {
                            "bedSize": "39",
                            "price": "1,799"
                        },
                        {
                            "bedSize": "48",
                            "price": "1,999"
                        },
                        {
                            "bedSize": "78",
                            "price": "3,599"
                        }
                    ]
                },
                {
                    "id": "air-mattress",
                    "label": "Air",
                    "showUpFor": [
                        {
                            "bedSize": "39",
                            "price": "2,999"
                        },
                        {
                            "bedSize": "48",
                            "price": "3,999"
                        },
                        {
                            "bedSize": "78",
                            "price": "5,999"
                        }
                    ]
                }
            ]
        },
        {
            "id": "q6",
            "type": "multi",
            "section-number": "2",
            "section-text": "User Details",
            "question": "Add any safety accessories?",
            "image": [
                {
                    "showIf": "bed size 78 and mid-high risk level",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/03/Question-6-no-nightlight.png"
                },
                {
                    "showIf": "Mid risk level and bed size 39 or 48",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/03/Question-6.png"
                }
            ],
            "qinfo": "Helper Bar assists with getting in and out of bed. Additional Rails provide extra fall protection. Auto Nightlight illuminates the floor when getting out of bed. Rail Pads add cushioning for comfort and safety.",
            "options": [
                {
                    "id": "helper-bar",
                    "label": "Helper bar",
                    "price": "369"
                },
                {
                    "id": "additional-rails",
                    "label": "Additional Rails",
                    "price": "594",
                    "preSelectIf": "mid-high risk"
                },
                {
                    "id": "underbed-light",
                    "label": "Auto Nightlight",
                    "price": "219",
                    "preSelectIf": "mid-high risk and bed 39 or 48",
                    "disableIf": "bed size 78"
                },
                {
                    "id": "rail-pads",
                    "label": "Rail pads",
                    "price": "99"
                }
            ]
        },
        {
            "id": "q7",
            "type": "multi",
            "section-number": "2",
            "section-text": "User Details",
            "question": "Add any comfort accessories?",
            "image":  [
                {
                    "showIf": "bed size selected is 39 or 48",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/03/Question-7-A.png"
                },
                {
                    "showIf": "bed size selected 78",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/03/Question-7-B-for-78-1.png"
                }
            ],
            "qinfo": "Overbed Table provides convenient extra large surface for eating or other daily activities. Rail Organizer keeps often-used items like glasses, remotes and reading material within reach. Reading Light is flexible for easy positioning. Extension Kit adds 8 inches of length for taller users.",
            "options": [
                {
                    "id": "overbed-table",
                    "label": "Overbed table",
                    "price": "789"
                },
                {
                    "id": "rail-organizer",
                    "label": "Rail organizer",
                    "price": "89"
                },
                {
                    "id": "reading-light",
                    "label": "Reading Light",
                    "price": "179",
                    "disableIf": "bed size 78"
                },
                {
                    "id": "extension-kit",
                    "label": "Extension Kit",
                    "PriceCondition": [
                        {
                            "ShowforBedSize": "39",
                            "price": "449"
                        },
                        {
                            "ShowforBedSize": "48",
                            "price": "489"
                        },
                        {
                            "ShowforBedSize": "78",
                            "price": "829"
                        }
                    ],
                    "preSelectIf": "user is tall"
                }
            ]
        },
        {
            "id": "q8",
            "type": "multi",
            "section-number": "2",
            "section-text": "User Details",
            "question": "Add any functionality accessories?",
            "image": [
                {
                    "showIf": "bed size selected is 39 or 48",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/03/Question-8-new-slide.png"
                },
                {
                    "showIf": "bed size selected 78",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/03/Question-8-for-78.png"
                }
            ],
            "qinfo": "Battery Back-up provides emergency power in case of outage. Transport Cart makes it easier to move the bed between rooms or locations.",
            "options": [
                {
                    "id": "transport-cart",
                    "label": "Transport cart",
                    "price": "199"
                },
                {
                    "id": "battery-backup",
                    "label": "Battery back-up",
                    "PriceCondition": [
                        {
                            "ShowforBedSize": "39 or 48",
                            "price": "149"
                        },
                        {
                            "ShowforBedSize": "78",
                            "price": "279"
                        }
                    ]
                }

            ]
        },
        {
            "id": "q9",
            "type": "multi",
            "section-number": "2",
            "section-text": "User Details",
            "question": "Add any premium bedding?",
            "image": [
                {
                    "showIf": "bed size is 39 or 78",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/03/Question-9-all-4.png"
                },
                {
                    "showIf": "bed size 48",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/03/Question-9-for-48.png"
                }
            ],
            "qinfo": "Premium bedding designed for comfort and durability. Microfiber or cotton sheets including fitted sheet, flat sheet and pillowcases, the Heavenly Pillow provides optimal support, and Duvet and cover set completes your bed setup.",
            "options": [
                {
                    "id": "microfiber-sheets",
                    "label": "Microfiber Sheets",
                    "colour": "white",
                    "PriceCondition": [
                        {
                            "ShowforBedSize": "39",
                            "price": "99"
                        }
                    ]
                },
                {
                    "id": "cotton-sheets",
                    "label": "Cotton sheets",
                    "colour": "white",
                    "PriceCondition": [
                        {
                            "ShowforBedSize": "39",
                            "price": "169"
                        },
                        {
                            "ShowforBedSize": "48",
                            "price": "199"
                        },
                        {
                            "ShowforBedSize": "78",
                            "price": "269"
                        }
                    ]
                },
                {
                    "id": "heavenly-pillow",
                    "label": "Heavenly pillow",
                    "price": "189"
                },
                {
                    "id": "duvet-&-duvetcover",
                    "label": "Duvet and cover",
                    "PriceCondition": [
                        {
                            "ShowforBedSize": "39",
                            "price": "469"
                        },
                        {
                            "ShowforBedSize": "48",
                            "price": "529"
                        },
                        {
                            "ShowforBedSize": "78",
                            "price": "619"
                        }
                    ]
                }
            ]

        },
        {
            "id": "q10",
            "type": "single select",
            "section-number": "3",
            "section-text": "Delivery & Service",
            "question": "How would you like your bed delivered?",
            "image": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-10.png",
            "qinfo": "Most of our clients prefer White Glove which will includes <b>Delivery and Installation</b>, where our team will schedule our arrival, deliver the bed to your desired room, fully-set up the bed, remove all packaging and provide a brief demonstration of the operation.<br/>We also know that emergency situations sometimes occur, so if you need a bed delivered urgently, we have Rush and Expedited options for our White Glove deliveries.Regardless of the selection you make, your delivery will always be coordinated for a time window that works for you.<br/>Occasionally, some customers will choose to pick up with their own vehicle and personnel or just have the bed dropped on a pallet at their driveway or dock.<br/> Guaranteed delivery timeframes are business days.",
            "options": [
                {
                    "id": "standard",
                    "label": "Standard White Glove<br/><span style=\"font-size:12px;\">10-21 days Delivery & Installation</span>",
                    "PriceCondition": [
                        {
                            "ShowforBedSize": "39 or 48",
                            "price": "599"
                        },
                        {
                            "ShowforBedSize": "78",
                            "price": "899"
                        }
                    ]
                },
                {
                    "id": "expedited",
                    "label": "Expedited White Glove<br/><span style=\"font-size:12px;\">4-9 days Delivery & Installation</span>",
                    "PriceCondition": [
                        {
                            "ShowforBedSize": "39 or 48",
                            "price": "899"
                        },
                        {
                            "ShowforBedSize": "78",
                            "price": "1299"
                        }
                    ]
                },
                {
                    "id": "rush",
                    "label": "Rush White Glove<br/><span style=\"font-size:12px;\">1-3 days Delivery & Installation</span>",
                    "PriceCondition": [
                        {
                            "ShowforBedSize": "39 or 48",
                            "price": "1,199"
                        },
                        {
                            "ShowforBedSize": "78",
                            "price": "1,699"
                        }
                    ]
                },
                {
                    "id": "drop-ship",
                    "label": "Drop ship<br/><span style=\"font-size:12px;\">(Driveway or Loading Dock)</span>",
                    "PriceCondition": [
                        {
                            "ShowforBedSize": "39 or 48",
                            "price": "449"
                        },
                        {
                            "ShowforBedSize": "78",
                            "price": "799"
                        }
                    ]
                },
                {
                    "id": "pickup",
                    "label": "Pick-up<br/><span style=\"font-size:12px;\">(At Regional Warehouse)</span>",
                    "price": "0"
                }
            ]
        },
        {
            "id": "q11",
            "type": "single select",
            "section-number": "3",
            "section-text": "Delivery & Service",
            "question": "Any warranty upgrade?",
            "image": "https://www.sondermirror.com/wp-content/uploads/2026/03/Question-12.png",
            "qinfo": " All SonderCare beds come with a full 5-year comprehensive parts warranty. Many of our clients prefer to add the corresponding 5-year labor coverage to perform any required service work. All repairs and troubleshooting will be completed by a SonderCare authorized service technician.",
            "options": [
                {
                    "id": "5year-only-parts",
                    "label": "5 Year Warranty<br/>All Parts",
                    "price": "0"

                },
                {
                    "id": "5year-parts-and-labor",
                    "label": "5 Year Warranty<br/>Parts & Labor",
                    "price": "199"
                }
            ]
        }
    ]
};

// State management
const state = {
    currentQuestionIndex: 0,
    answers: {},
    visibleQuestions: [],
    contactType: null,
    selectedBedSize: null,
    autoSelectedAccessories: [],
    needsExtensionKit: false,
    quoteNumber: null
};

// DOM Elements
const quizContainer = document.getElementById('quizContainer');
const resultsContainer = document.getElementById('resultsContainer');
const navigationContainer = document.getElementById('navigationContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const sectionNumber = document.querySelector('.section-number');
const sectionText = document.querySelector('.section-text');

document.querySelector('#navigationContainer').style.display = 'none';

// FIX #3: Smoother transitions - Initialize the quiz
function initQuiz() {
    const introContainer = document.querySelector('.beforeQuizStarts-container');
    introContainer.classList.add('fade-out');

    setTimeout(() => {
        // Fade in navigation smoothly
        const navContainer = document.querySelector('#navigationContainer');
        navContainer.style.display = 'flex';
        navContainer.style.opacity = '0';
        setTimeout(() => {
            navContainer.style.transition = 'opacity 0.5s ease-in';
            navContainer.style.opacity = '1';
        }, 50);

        document.querySelector('.showUpForQuiz').style.display = 'block';

        let firstSentence = document.querySelectorAll('.hideForQuiz');
        firstSentence.forEach(item => {
            item.style.display = 'none';
        });

        buildVisibleQuestionsList();
        renderQuestion(state.currentQuestionIndex, true);
        updateProgressBar();
        updateNavigationButtons();
        updateSectionInfo();

        prevBtn.addEventListener('click', goToPreviousQuestion);
        nextBtn.addEventListener('click', goToNextQuestion);

        const contactOptions = document.querySelectorAll('.contact-option');
        contactOptions.forEach(option => {
            option.addEventListener('click', handleContactOptionClick);
        });

        document.getElementById('submitEmail').addEventListener('click', handleEmailSubmit);
        document.getElementById('submitPhone').addEventListener('click', handlePhoneSubmit);
    }, 500);
}

// ... buildVisibleQuestionsList, shouldShowQuestion, getSelectedBedSize stay the same ...

function buildVisibleQuestionsList() {
    state.visibleQuestions = [];
    quizData.questions.forEach((question, index) => {
        if (shouldShowQuestion(question)) {
            state.visibleQuestions.push(index);
        }
    });
}

function shouldShowQuestion(question) {
    if (!question.showIf) return true;
    const q1Answer = state.answers['q1'];
    if (question.showIf === 'No-KingBed-selected') {
        return q1Answer && q1Answer !== '78';
    }
    if (question.showIf === 'KingBed-selected') {
        return q1Answer === '78';
    }
    return true;
}

function getSelectedBedSize() {
    const q1Answer = state.answers['q1'];
    if (!q1Answer) return null;
    const q1 = quizData.questions.find(q => q.id === 'q1');
    const selectedOption = q1.options.find(opt => opt.id === q1Answer);
    return selectedOption ? selectedOption.size : null;
}

function shouldShowOption(option, question) {
    const bedSize = getSelectedBedSize();
    if (option.showUpFor) {
        return option.showUpFor.some(condition => {
            return condition.bedSize === bedSize ||
                (bedSize === '48' && condition.bedSize === '48') ||
                (bedSize === '78(King)' && condition.bedSize === '78');
        });
    }
    if (option.id === 'microfiber-sheets') {
        return bedSize === '39';
    }
    if (option.disableIf) {
        const condition = option.disableIf.toLowerCase();
        if (condition.includes('bed size 78') && bedSize === '78(King)') {
            return false;
        }
    }
    return true;
}

function shouldPreSelectOption(option, question) {
    const bedSize = getSelectedBedSize();
    const fallRisk = state.answers['q4'];
    const height = state.answers['q3'];
    if (!option.preSelectIf) return false;
    const condition = option.preSelectIf.toLowerCase();
    if (condition === 'mid-high risk') {
        return fallRisk === 'safety-acc-yes';
    }
    if (condition.includes('mid-high risk') && condition.includes('bed 39 or 48')) {
        return fallRisk === 'safety-acc-yes' && (bedSize === '39' || bedSize === '48');
    }
    if (condition === 'user is tall') {
        return height === 'extensionkit-yes';
    }
    return false;
}

function getOptionPrice(option) {
    const bedSize = getSelectedBedSize();
    if (!bedSize) return null;

     if (option.id === 'no-mattress-selected') {
        return '0';
    }

    if (option.price && typeof option.price === 'string') {
        return option.price;
    }
    if (option.id === 'extension-kit-addon') {
        return getExtensionKitPrice();
    }
    if (option.showUpFor && Array.isArray(option.showUpFor)) {
        for (let condition of option.showUpFor) {
            if (condition.bedSize === bedSize) return condition.price;
            if (bedSize === '48' && condition.bedSize === '48') return condition.price;
            if (bedSize === '78(King)' && condition.bedSize === '78') return condition.price;
            if (bedSize === '39' && condition.bedSize === '39') return condition.price;
        }
        return null;
    }
    if (option.PriceCondition) {
        for (let condition of option.PriceCondition) {
            const showFor = condition.ShowforBedSize || condition.BedSize;
            if (showFor === bedSize) return condition.price;
            if (showFor && showFor.includes('or')) {
                const sizes = showFor.split(' or ').map(s => s.trim());
                if (sizes.includes(bedSize)) return condition.price;
            }
            if (showFor === '78' && bedSize === '78(King)') return condition.price;
        }
    }
if (Array.isArray(option.price)) {
        for (let priceObj of option.price) {
            // Check if this is the old format with ShowforBedSize
            if (priceObj.ShowforBedSize) {
                const showFor = priceObj.ShowforBedSize;
                if (showFor === bedSize) return priceObj.price;
                if (showFor && showFor.includes('or')) {
                    const sizes = showFor.split(' or ').map(s => s.trim());
                    if (sizes.includes(bedSize)) return priceObj.price;
                }
                if (showFor === '78' && bedSize === '78(King)') return priceObj.price;
            }
            // Old format compatibility
            for (let key in priceObj) {
                if (key.includes(bedSize.replace('(King)', ''))) {
                    return priceObj[key];
                }
            }
        }
    }
    return null;
}

function getCurrentQuestionImage(question) {
    if (Array.isArray(question.image)) {
        const bedSize = getSelectedBedSize();
        const fallRisk = state.answers['q4'];
        for (let imageCondition of question.image) {
            const condition = imageCondition.showIf.toLowerCase();
            if (condition.includes('bed size')) {
                if (condition.includes('39 or 78') || condition.includes('39 or 48')) {
                    const sizes = condition.match(/\d+/g);
                    if (sizes && sizes.includes(bedSize ? bedSize.replace('(King)', '') : '')) {
                        return imageCondition['img-url'];
                    }
                } else if (condition.includes('48') && bedSize === '48') {
                    return imageCondition['img-url'];
                } else if (condition.includes('78') && bedSize === '78(King)') {
                    return imageCondition['img-url'];
                } else if (condition.includes('39') && bedSize === '39') {
                    return imageCondition['img-url'];
                }
            }
            if (condition.includes('mid-high risk') || condition.includes('high risk')) {
                const isHighRisk = fallRisk === 'safety-acc-yes';
                if (isHighRisk) {
                    if (condition.includes('78') && bedSize === '78(King)') {
                        return imageCondition['img-url'];
                    } else if ((condition.includes('39 or 48')) && (bedSize === '39' || bedSize === '48')) {
                        return imageCondition['img-url'];
                    } else if (!condition.includes('bed size')) {
                        return imageCondition['img-url'];
                    }
                }
            }
        }
        return question.image[0] ? question.image[0]['img-url'] : '';
    }
    if (typeof question.image === 'string') {
        return question.image;
    }
    return '';
}

function checkQuestionInfoHeight(questionId) {
    const infoElement = document.getElementById(`qinfo-${questionId}`);
    const toggleButton = document.getElementById(`toggle-${questionId}`);
    if (!infoElement || !toggleButton) return;
    infoElement.classList.remove('collapsed');
    const actualHeight = infoElement.scrollHeight;
    const lineHeight = parseFloat(getComputedStyle(infoElement).lineHeight);
    if (actualHeight > (lineHeight * 1.2)) {
        toggleButton.style.display = 'inline';
        infoElement.classList.add('collapsed');
    } else {
        toggleButton.style.display = 'none';
        infoElement.classList.remove('collapsed');
    }
}

// FIX #3: Smoother transitions - Render question
function renderQuestion(visibleIndex, isFirstQuestion = false) {
    const actualIndex = state.visibleQuestions[visibleIndex];
    const question = quizData.questions[actualIndex];
    if (!question) return;

    // Fade out current question first
    const currentCard = quizContainer.querySelector('.question-card.active');
    if (currentCard && !isFirstQuestion) {
        currentCard.style.opacity = '0';
        currentCard.style.transform = 'translateY(-10px)';
    }

    setTimeout(() => {
        const questionImage = getCurrentQuestionImage(question);
        let html = `
        <div class="question-card active ${isFirstQuestion ? 'fade-in-first' : ''}" data-question-id="${question.id}" style="opacity: 0; transform: translateY(10px);">
            <div class="question-header">
                <h2 class="question-title">${question.question}</h2>
                ${questionImage ? `<img src="${questionImage}" alt="Question image" class="question-image" onerror="this.style.display='none'" id="question-image-${question.id}">` : ''}
               ${question.qinfo ? `<div class="question-info-wrapper">
    <div class="question-info collapsed" id="qinfo-${question.id}">${question.qinfo}</div>
    <span class="see-more-toggle" id="toggle-${question.id}" onclick="toggleQuestionInfo('${question.id}')" style="display: none;">More</span>
</div>` : ''}
            <div class="options-container">
    `;

        const isMultiSelect = question.type === 'multi';
        const inputType = isMultiSelect ? 'checkbox' : 'radio';
        const inputName = question.id;
        question.isMultiSelect = isMultiSelect;

        let visibleOptions = question.options.filter(opt => shouldShowOption(opt, question));


        visibleOptions.forEach(option => {
            const shouldPreSelect = shouldPreSelectOption(option, question);
            if (shouldPreSelect && isMultiSelect) {
                if (!state.answers[question.id]) {
                    state.answers[question.id] = [];
                }
                if (!state.answers[question.id].includes(option.id)) {
                    state.answers[question.id].push(option.id);
                }
            }

            const isChecked = isMultiSelect
                ? (state.answers[question.id] && state.answers[question.id].includes(option.id))
                : (state.answers[question.id] === option.id);

            html += `
        <div class="option-item">
            <input 
                type="${inputType}" 
                id="${option.id}" 
                name="${inputName}" 
                value="${option.id}"
                ${isChecked ? 'checked' : ''}
                onchange="handleOptionChange('${question.id}', '${option.id}', ${isMultiSelect})">
            <label for="${option.id}" class="option-label">
                <span>${option.label}</span>
            </label>
        </div>
    `;
        });

        const isQ5 = question.id === 'q5';
        if (isQ5) {
            const isSkipSelected = state.answers[question.id] === 'no-mattress-selected';
            html += `<div class="skip-option-item">
        <div class="skip-option-label ${isSkipSelected ? 'selected' : ''}" onclick="skipMattressQuestion('${question.id}')">
            <span>None Required</span>
        </div>
    </div>`;
        }

        if (isMultiSelect && !isQ5) {
            const isSkipSelected = Array.isArray(state.answers[question.id]) && state.answers[question.id].length === 0;
            html += `
            <div class="skip-option-item">
            <div class="skip-option-label ${isSkipSelected ? 'selected' : ''}" onclick="skipQuestion('${question.id}')">
                <span>None Required</span>
            </div>
        </div>
        `;
        }

        html += `
            ${question['option-desc'] ? `<div class="option-description">${question['option-desc']}</div>` : ''}
        </div>
    `;

        quizContainer.innerHTML = html;
        // Smooth fade-in
        setTimeout(() => {
            const newCard = quizContainer.querySelector('.question-card');
            if (newCard) {
                newCard.style.transition = 'opacity 0.7s ease-in-out, transform 0.7s ease-in-out';
                newCard.style.opacity = '1';
                newCard.style.transform = 'translateY(0)';
            }
        }, 100);

        setTimeout(() => checkQuestionInfoHeight(question.id), 100);

        if (actualIndex == 5) {
            const qinfo = document.querySelector('#qinfo-q5');
            if (qinfo) qinfo.style.textAlign = 'left';
        }

        // ✅ FIX: Enable Next button if options are pre-selected
        setTimeout(() => {
            updateNavigationButtons();
        }, 100);

    }, isFirstQuestion ? 0 : 150);
}

// FIX #1: FIXED - Skip mattress with toggle functionality
function skipMattressQuestion(questionId) {
    const skipButton = document.querySelector('.skip-option-label');

    // Check if already selected
    const isCurrentlySkipped = state.answers[questionId] === 'no-mattress-selected';

    if (isCurrentlySkipped) {
        // TOGGLE OFF - Remove skip selection
        delete state.answers[questionId];
        skipButton.classList.remove('selected');
    } else {
        // SELECT - Set to skipped and clear any mattress selections
        state.answers[questionId] = 'no-mattress-selected';
        skipButton.classList.add('selected');

        // Uncheck all mattress radio buttons
        const inputs = document.querySelectorAll(`input[name="${questionId}"]`);
        inputs.forEach(input => {
            input.checked = false;
        });
    }

    updateNavigationButtons();
}

// FIX #1: FIXED - Skip accessories with toggle and deselect functionality
function skipQuestion(questionId) {
    const skipButton = document.querySelector('.skip-option-label:last-of-type');

    // Check if currently skipped
    const isCurrentlySkipped = Array.isArray(state.answers[questionId]) && state.answers[questionId].length === 0;

    if (isCurrentlySkipped) {
        // TOGGLE OFF - Remove skip state
        delete state.answers[questionId];
        skipButton.classList.remove('selected');
    } else {
        // SELECT - Clear all selections and mark as skipped
        state.answers[questionId] = [];
        skipButton.classList.add('selected');

        // Uncheck all checkboxes including pre-selected ones
        const inputs = document.querySelectorAll(`input[name="${questionId}"]`);
        inputs.forEach(input => {
            input.checked = false;
        });
    }

    updateNavigationButtons();
}

// FIX #1: FIXED - Handle option change with skip button deselection
function handleOptionChange(questionId, optionId, isMultiSelect) {
    if (isMultiSelect) {
        if (!state.answers[questionId]) {
            state.answers[questionId] = [];
        }

        const index = state.answers[questionId].indexOf(optionId);
        if (index > -1) {
            state.answers[questionId].splice(index, 1);
        } else {
            state.answers[questionId].push(optionId);
        }

        // FIX #1: Remove 'selected' from skip button when any option is selected
        const skipButton = document.querySelector('.skip-option-label:last-of-type');
        if (skipButton && state.answers[questionId].length > 0) {
            skipButton.classList.remove('selected');
        }
    } else {
        state.answers[questionId] = optionId;

        // FIX #1: Remove 'selected' from skip button for Q5
        const skipLabel = document.querySelector('.skip-option-label');
        if (skipLabel && questionId === 'q5') {
            skipLabel.classList.remove('selected');
        }

        if (questionId === 'q1') {
            state.selectedBedSize = getSelectedBedSize();
            buildVisibleQuestionsList();
            updateConditionalImages();
        }

        if (questionId === 'q4') {
            updateConditionalImages();
            if (state.answers['q6']) {
                state.answers['q6'] = state.answers['q6'].filter(
                    id => id !== 'Additional-rails' && id !== 'underbed-light'
                );
            }
        }

        if (questionId === 'q11') {
            buildVisibleQuestionsList();
        }
    }

    updateNavigationButtons();
}

function updateConditionalImages() {
    const actualIndex = state.visibleQuestions[state.currentQuestionIndex];
    const question = quizData.questions[actualIndex];
    const imageElement = document.getElementById(`question-image-${question.id}`);
    if (!imageElement) return;
    const newImage = getCurrentQuestionImage(question);
    if (newImage && newImage !== imageElement.src) {
        imageElement.src = newImage;
    }
}

function goToNextQuestion() {
    const actualIndex = state.visibleQuestions[state.currentQuestionIndex];
    const currentQuestion = quizData.questions[actualIndex];
    if (!isQuestionAnswered(currentQuestion)) {
        alert('Please select an option before continuing.');
        return;
    }
    if (state.currentQuestionIndex >= state.visibleQuestions.length - 1) {
        showResults();
        return;
    }
    state.currentQuestionIndex++;
    renderQuestion(state.currentQuestionIndex);
    updateProgressBar();
    updateNavigationButtons();
    updateSectionInfo();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPreviousQuestion() {
    if (state.currentQuestionIndex <= 0) return;
    state.currentQuestionIndex--;
    renderQuestion(state.currentQuestionIndex);
    updateProgressBar();
    updateNavigationButtons();
    updateSectionInfo();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function isQuestionAnswered(question) {
    const answer = state.answers[question.id];
    if (question.isMultiSelect) {
        return answer !== undefined && Array.isArray(answer);
    } else {
        return answer && answer !== '';
    }
}

function updateProgressBar() {
    const progress = ((state.currentQuestionIndex + 1) / state.visibleQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function updateNavigationButtons() {
    prevBtn.disabled = state.currentQuestionIndex === 0;
    const actualIndex = state.visibleQuestions[state.currentQuestionIndex];
    const currentQuestion = quizData.questions[actualIndex];
    const isAnswered = isQuestionAnswered(currentQuestion);
    nextBtn.disabled = !isAnswered;
    if (state.currentQuestionIndex >= state.visibleQuestions.length - 1) {
        nextBtn.textContent = 'See Results →';
    } else {
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    }
}

function updateSectionInfo() {
    const actualIndex = state.visibleQuestions[state.currentQuestionIndex];
    const question = quizData.questions[actualIndex];
    sectionNumber.textContent = question['section-number'];
    if (question['section-text']) {
        sectionText.textContent = question['section-text'];
    }
}

function toggleQuestionInfo(questionId) {
    const infoElement = document.getElementById(`qinfo-${questionId}`);
    const toggleButton = document.getElementById(`toggle-${questionId}`);
    if (infoElement.classList.contains('collapsed')) {
        infoElement.classList.remove('collapsed');
        infoElement.classList.add('expanded');
        toggleButton.innerHTML = 'Less';
    } else {
        infoElement.classList.remove('expanded');
        infoElement.classList.add('collapsed');
        toggleButton.innerHTML = 'More';
    }
}

function generateQuoteNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = String(Math.floor(100 + Math.random() * 900));
    return `SC-${year}${month}${day}-9${random}`;
}

function showResults() {
    quizContainer.style.display = 'none';
    navigationContainer.style.display = 'none';
    resultsContainer.classList.add('active');
    state.quoteNumber = generateQuoteNumber();
    generateResultsSummary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// FIX #2: Individual accessory prices in price column
function generateResultsSummary() {
    document.querySelector('.showUpForQuiz').innerHTML = 'Quiz Results';
    const summaryContainer = document.getElementById('resultsSummary');
    let html = `<h3 class="quote-number-text">Quote Number: ${state.quoteNumber}</h3>`;

    html += `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #f5f5f5; border-bottom: 2px solid #25385b;">
                    <th style="padding: 12px; text-align: left; font-weight: 600; color: #25385b;font-size:1.15rem;">Item</th>
                    <th style="padding: 12px; text-align: left; font-weight: 600; color: #25385b;font-size:1.15rem;">Selection</th>
                    <th style="padding: 12px; text-align: right; font-weight: 600; color: #25385b;font-size:1.15rem;">Price</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalPrice = 0;

    state.visibleQuestions.forEach(questionIndex => {
        const question = quizData.questions[questionIndex];
        const answer = state.answers[question.id];

        // ✅ FIX ISSUE #1: Show "None Required" mattress selection
        if (question.id === 'q5' && answer === 'no-mattress-selected') {
            html += `
                <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 12px; color: #666;">${question.question}</td>
                    <td style="padding: 12px; font-weight: 500;">None Required</td>
                    <td style="padding: 12px; text-align: right; color: #C3AB74; font-weight: 600;">—</td>
                </tr>
            `;
            return; // Skip further processing for this question
        }

        if (question.isMultiSelect || answer) {
            if (Array.isArray(answer) && answer.length > 0) {
                // FIX #2: Show each accessory on separate row with individual price
                answer.forEach((id, index) => {
                    const option = question.options.find(opt => opt.id === id);
                    if (option) {
                        const price = getOptionPrice(option);
                        const priceNum = price !== null && price !== undefined ? parseFloat(price.replace(/,/g, '')) : 0;
                        totalPrice += priceNum;
                        const priceDisplay = price !== null && price !== undefined ? '$' + price : '—';

                        html += `
                        <tr style="border-bottom: 1px solid #e0e0e0;">
                            <td style="padding: 12px; color: #666; vertical-align: top;">${index === 0 ? question.question : ''}</td>
                            <td style="padding: 12px; font-weight: 500;">${option.label}</td>
                            <td style="padding: 12px; text-align: right; color: #C3AB74; font-weight: 600;">${priceDisplay}</td>
                        </tr>
                        `;
                    }
                });
            } else if (answer && !Array.isArray(answer)) {
                const option = question.options.find(opt => opt.id === answer);
                if (option) {
                    let price = getOptionPrice(option);
                    let priceNum = 0;
                    let selectionText = option.label;
                    let contextNote = '';

                    if (question.id === 'q1') {
                        const q2bed = quizData.questions.find(q => q.id === 'q2-bed');
                        const q2headboard = quizData.questions.find(q => q.id === 'q2-headboard');
                        let bedName = '';
                        let bedPrice = null;

                        if (state.answers['q2-bed']) {
                            const bedOption = q2bed?.options.find(opt => opt.id === state.answers['q2-bed']);
                            if (bedOption) {
                                if (bedOption.SelectedBed) {
                                    bedName = ` (${bedOption.SelectedBed})`;
                                }
                                bedPrice = getOptionPrice(bedOption);
                            }
                        } else if (state.answers['q2-headboard']) {
                            const headboardOption = q2headboard?.options.find(opt => opt.id === state.answers['q2-headboard']);
                            if (headboardOption) {
                                bedName = ' (Split King)';
                                bedPrice = getOptionPrice(headboardOption);
                            }
                        }

                        selectionText = option.label + bedName;
                        if (bedPrice) {
                            price = bedPrice;
                        }
                    } else if (question.id === 'q2-bed' || question.id === 'q2-headboard') {
                        if (option.SelectedBed) {
                            selectionText = `${option.SelectedBed} - ${option.label}`;
                        }
                        price = null;
                    } else if (question.id === 'q3') {
                        if (answer === 'extensionkit-yes') {
                            contextNote = '<div style="color: #666; font-size: 0.9em; font-style: italic; margin-top: 5px;">Extension Kit recommended below</div>';
                        }
                    } else if (question.id === 'q4') {
                        if (answer === 'safety-acc-yes') {
                            contextNote = '<div style="color: #666; font-size: 0.9em; font-style: italic; margin-top: 5px;">Safety Accessories recommended below</div>';
                        }
                    }

                    if (price !== null && price !== undefined && price !== '0') {
                        priceNum = parseFloat(price.replace(/,/g, ''));
                        totalPrice += priceNum;
                    }

                    html += `
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px; color: #666;">${question.question}</td>
                        <td style="padding: 12px; font-weight: 500;">
                            ${selectionText}
                            ${contextNote}
                        </td>
                        <td style="padding: 12px; text-align: right; color: #C3AB74; font-weight: 600;">
                            ${price !== null && price !== undefined ? '$' + price : '—'}
                        </td>
                    </tr>
                    `;
                }
            } else if (question.isMultiSelect) {
                html += `
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px; color: #666;">${question.question}</td>
                        <td style="padding: 12px; font-style: italic; color: #999;">None selected</td>
                        <td style="padding: 12px; text-align: right;">—</td>
                    </tr>
                `;
            }
        }
    });

    html += `
            </tbody>
        </table>
    `;

    html += `
        <div style="background: #25385b; color: white; padding: 20px; margin-top: 25px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 1.2em;">
                <span style="font-weight: 600;">Estimated Subtotal:</span>
                <span style="color: #C3AB74; font-weight: 700; font-size: 1.3em;">
                    $${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
            </div>
        </div>
    `;

    summaryContainer.innerHTML = html;
}

function handleContactOptionClick(e) {
    const option = e.currentTarget;
    const contactType = option.getAttribute('data-contact-type');
    document.querySelectorAll('.contact-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    option.classList.add('selected');
    document.getElementById('emailForm').classList.remove('active');
    document.getElementById('phoneForm').classList.remove('active');
    document.getElementById('successMessage').classList.remove('active');
    if (contactType === 'email') {
        document.getElementById('emailForm').classList.add('active');
    } else if (contactType === 'phone') {
        document.getElementById('phoneForm').classList.add('active');
    }
    state.contactType = contactType;
}

function handleEmailSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;
    const name = document.getElementById('nameInput').value;
    const phone = document.getElementById('phoneInputOptional').value;
    const notes = document.getElementById('notesInput').value;
    if (!email || !name) {
        alert('Please fill in all required fields.');
        return;
    }
    const submissionData = {
        quoteNumber: state.quoteNumber,
        contactType: 'email',
        email: email,
        name: name,
        phone: phone,
        notes: notes,
        answers: state.answers,
        bedSize: state.selectedBedSize,
        timestamp: new Date().toISOString()
    };
    const formData = new FormData();
    formData.append('action', 'submit_bed_selector');
    formData.append('data', JSON.stringify(submissionData));
    const submitBtn = document.getElementById('submitEmail');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('emailForm').classList.remove('active');
                document.getElementById('successMessage').classList.add('active');
            } else {
                alert('There was an error submitting your request. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Me the Quote';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your request. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Me the Quote';
        });
}

function handlePhoneSubmit(e) {
    e.preventDefault();
    const phone = document.getElementById('phoneInput').value;
    const name = document.getElementById('phoneNameInput').value;
    const notes = document.getElementById('phoneNotesInput').value;
    if (!phone || !name) {
        alert('Please fill in all required fields.');
        return;
    }
    const submissionData = {
        quoteNumber: state.quoteNumber,
        contactType: 'phone',
        phone: phone,
        name: name,
        notes: notes,
        answers: state.answers,
        bedSize: state.selectedBedSize,
        timestamp: new Date().toISOString()
    };
    const formData = new FormData();
    formData.append('action', 'submit_bed_selector');
    formData.append('data', JSON.stringify(submissionData));
    const submitBtn = document.getElementById('submitPhone');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('phoneForm').classList.remove('active');
                document.getElementById('successMessage').classList.add('active');
            } else {
                alert('There was an error submitting your request. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Request a Call';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your request. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Request a Call';
        });
}

document.querySelector('.startQuiz').addEventListener('click', initQuiz, false);
