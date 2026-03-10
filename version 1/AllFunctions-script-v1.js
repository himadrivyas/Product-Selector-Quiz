// Bed Selector Quiz JavaScript - WordPress Version with Advanced Conditional Logic
// JSON data is loaded via wp_localize_script from PHP

// Parse the quiz data passed from WordPress
const quizData = {
    "meta": {
        "version": "1.5",
        "currency": "USD",
        "company": "SonderCare"
    },
    "questions": [
        {
            "id": "q1",
            "type": "single select",
            "section-number": "1",
            "section-text": "size & style",
            "question": "Which bed width is preferred?",
            "required": "true",
            "image": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-1.png",
            "qinfo": "Basic hospital beds are 36\" wide. The 39\" SonderCare standard width is great for users who are comfortable in smaller sleeping areas, don't move a lot during sleep, or who have smaller rooms. The 48\" width is ideal for larger users, anyone who tends to move through the night or is accustomed to larger bed sizes.",
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
            "section-text": "size & style",
            "question": "Which finish do you prefer?",
            "showIf": "No-KingBed-selected",
            "image": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-2-A.png",
            "qinfo": "Choose Standard Espresso woodgrain or upgraded Slate Gray fabric (fluid-proof, stain and odor-resistant). Both finishes look warm and inviting. Select the option that best suits the user and the room décor.",
            "options": [
                {
                    "id": "premium",
                    "label": "woodgrain",
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
            "section-text": "size & style",
            "question": "Which finish do you prefer?",
            "showIf": "KingBed-selected",
            "image": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-2-B.png",
            "qinfo": "Choose Standard Espresso woodgrain or upgraded Slate Gray fabric (fluid-proof, stain and odor-resistant). Both finishes look warm and inviting. Select the option that best suits the user and the room décor.",
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
            "section-text": "size & style",
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
            "section-text": "User details",
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
                    "label": "Mid - High risk"
                }
            ]
        },
        {
            "id": "q5",
            "type": "single select",
            "section-number": "2",
            "section-text": "User details",
            "question": "Which mattress do you prefer?",
            "qinfo": "Choose from our range of premium mattresses designed specifically for adjustable beds.",
            "image": [
                {
                    "showIf": "bed size is 39 or 78",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-5-all-4.png"
                },
                {
                    "showIf": "bed size 48",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-5-no-comfort.png"
                }
            ],
            "options": [
                {
                    "id": "comfort-mattress",
                    "label": "comfort",
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
                    "label": "dream",
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
                    "label": "signature hybrid",
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
                },
                {
                    "id": "no-mattress",
                    "label": "No Mattress needed"
                }
            ]
        },
        {
            "id": "q6",
            "type": "multi",
            "section-number": "2",
            "section-text": "User details",
            "question": "Add any safety accessories?",
            "image": [
                {
                    "showIf": "bed size 78 and mid-high risk level",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/02/Quiz-5-3Matt.jpg"
                },
                {
                    "showIf": "Mid risk level and bed size 39 or 48",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-6.png"
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
            "section-text": "User details",
            "question": "Add any comfort accessories?",
            "image": [
                {
                    "showIf": "bed size selected is 39 or 48",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-7-A.png"
                },
                {
                    "showIf": "bed size selected 78",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-7-B-for-78.png"
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
                    "label": "8\" Length Extension Kit",
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
            "section-text": "User details",
            "question": "Add any functionality accessories?",
            "image": [
                {
                    "showIf": "bed size selected is 39 or 48",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-8-new-slide.png"
                },
                {
                    "showIf": "bed size selected 78",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-8-for-78.png"
                }
            ],
            "qinfo": "Battery Back-up provides emergency power in case of outage. Transport Cart makes it easier to move the bed between rooms or locations.",
            "options": [
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
                },
                {
                    "id": "transport-cart",
                    "label": "Transport cart",
                    "price": "199"
                }
            ]
        },
        {
            "id": "q9",
            "type": "multi",
            "section-number": "2",
            "section-text": "User details",
            "question": "Add any premium bedding?",
            "image": [
                {
                    "showIf": "bed size is 39 or 78",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-9-all-4.png"
                },
                {
                    "showIf": "bed size 48",
                    "img-url": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-9-for-48.png"
                }
            ],
            "qinfo": "Premium bedding designed for comfort and durability. Microfiber and cotton sheets available in white. Heavenly pillow provides optimal support. Duvet and cover set completes your bed setup.",
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
            "section-text": "delivery",
            "question": "How would you like your bed delivered",
            "image": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-10.png",
            "qinfo": "Most of our clients prefer White Glove Delivery and Installation, where our team will schedule our arrival, deliver the bed to your desired room, fully-set up the bed, remove all packaging and provide a brief demonstration of the operation. Occasionally, some customers will choose to pick up with their own vehicle and personnel or just have the bed dropped on a pallet at their driveway or dock.",
            "options": [
                {
                    "id": "white-glove",
                    "label": "White glove delivery & install"
                },
                {
                    "id": "drop-ship",
                    "label": "Drop ship (driveway)",
                    "price": [
                        {
                            "BedSize": "39 or 48",
                            "price": "449"
                        },
                        {
                            "BedSize": "78",
                            "price": "799"
                        }
                    ]
                },
                {
                    "id": "pickup",
                    "label": "Pick-up at warehouse",
                    "price": "0"
                }
            ],
            "option-desc": ""
        },
        {
            "id": "q11",
            "type": "single select",
            "section-number": "3",
            "showIf": "white-glove delivery selected",
            "section-text": "delivery",
            "question": "How quickly do you need the bed",
            "image": "https://www.sondermirror.com/wp-content/uploads/2026/02/Question-11.png",
            "qinfo": "We know that emergency situations sometimes occur, so if you need a bed delivered urgently, please call us and we'll do everything we can to help. All deliveries, regardless of the selection you make, will always be coordinated for a time window that works for you. Guaranteed delivery timeframes are business days.",
            "options": [
                {
                    "id": "standard",
                    "label": "Standard (10-21 days)",
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
                    "label": "Expedited (4-9 days)",
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
                    "label": "Rush (1-3 days)",
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
    selectedBedSize: null, // Track bed size for conditional logic
    autoSelectedAccessories: [], // Track auto-added accessories
    needsExtensionKit: false, // Track if extension kit is needed
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

// Initialize the quiz
function initQuiz() {
    // Build the visible questions list based on all questions initially
    buildVisibleQuestionsList();

    // Render the first question
    renderQuestion(state.currentQuestionIndex);

    // Update UI
    updateProgressBar();
    updateNavigationButtons();
    updateSectionInfo();

    // Add event listeners
    prevBtn.addEventListener('click', goToPreviousQuestion);
    nextBtn.addEventListener('click', goToNextQuestion);

    // Contact option listeners
    const contactOptions = document.querySelectorAll('.contact-option');
    contactOptions.forEach(option => {
        option.addEventListener('click', handleContactOptionClick);
    });

    // Form submission listeners
    document.getElementById('submitEmail').addEventListener('click', handleEmailSubmit);
    document.getElementById('submitPhone').addEventListener('click', handlePhoneSubmit);
}

// Build the list of visible questions based on conditional logic
function buildVisibleQuestionsList() {
    state.visibleQuestions = [];

    quizData.questions.forEach((question, index) => {
        if (shouldShowQuestion(question)) {
            state.visibleQuestions.push(index);
        }
    });
}

// Check if a question should be shown based on showIf condition
function shouldShowQuestion(question) {
    if (!question.showIf) {
        return true; // No condition, always show
    }

    // Handle the conditional logic for q2-bed and q2-headboard
    const q1Answer = state.answers['q1'];

    if (question.showIf === 'No-KingBed-selected') {
        // Show q2-bed if NOT 78" (King) selected
        return q1Answer && q1Answer !== '78';
    }

    if (question.showIf === 'KingBed-selected') {
        // Show q2-headboard if 78" (King) selected
        return q1Answer === '78';
    }

    // Handle q10 - only show if white-glove delivery selected
    if (question.showIf === 'white-glove delivery selected') {
        const q10Answer = state.answers['q10'];
        return q10Answer === 'white-glove';
    }

    return true;
}

// Get the selected bed size from Q1
function getSelectedBedSize() {
    const q1Answer = state.answers['q1'];
    if (!q1Answer) return null;

    const q1 = quizData.questions.find(q => q.id === 'q1');
    const selectedOption = q1.options.find(opt => opt.id === q1Answer);

    return selectedOption ? selectedOption.size : null;
}

function shouldShowOption(option, question) {
    const bedSize = getSelectedBedSize();

    // For mattress options (q5) - check showUpFor
    if (option.showUpFor) {
        return option.showUpFor.some(condition => {
            return condition.bedSize === bedSize ||
                (bedSize === '48' && condition.bedSize === '48') ||
                (bedSize === '78(King)' && condition.bedSize === '78');
        });
    }

    // For microfiber sheets - only show for 39" bed
    if (option.id === 'microfiber-sheets') {
        return bedSize === '39';
    }

    // Check disableIf - if condition met, DON'T show option at all
    if (option.disableIf) {
        const condition = option.disableIf.toLowerCase();

        // Hide if bed size 78
        if (condition.includes('bed size 78') && bedSize === '78(King)') {
            return false; // HIDE instead of disable
        }
    }

    // ALL OTHER OPTIONS SHOW
    return true;
}


// Check if an option should be pre-selected
function shouldPreSelectOption(option, question) {
    const bedSize = getSelectedBedSize();
    const fallRisk = state.answers['q4'];
    const height = state.answers['q3'];

    if (!option.preSelectIf) return false;

    const condition = option.preSelectIf.toLowerCase();

    // "mid-high risk"
    if (condition === 'mid-high risk') {
        return fallRisk === 'safety-acc-yes';
    }

    // "mid-high risk and bed 39 or 48"
    if (condition.includes('mid-high risk') && condition.includes('bed 39 or 48')) {
        return fallRisk === 'safety-acc-yes' && (bedSize === '39' || bedSize === '48');
    }

    // "user is tall"
    if (condition === 'user is tall') {
        return height === 'extensionkit-yes';
    }

    return false;
}

// new function
function getOptionPrice(option) {
    const bedSize = getSelectedBedSize();
    if (!bedSize) return null;

    // Handle simple price (string)
    if (option.price && typeof option.price === 'string') {
        return option.price;
    }

    // Handle extension kit special case
    if (option.id === 'extension-kit-addon') {
        return getExtensionKitPrice();
    }


    // Handle showUpFor (mattresses use this)
    if (option.showUpFor && Array.isArray(option.showUpFor)) {
        for (let condition of option.showUpFor) {
            // Check for exact match
            if (condition.bedSize === bedSize) {
                return condition.price;
            }
            // Check for 48 match
            if (bedSize === '48' && condition.bedSize === '48') {
                return condition.price;
            }
            // Check for 78(King) match
            if (bedSize === '78(King)' && condition.bedSize === '78') {
                return condition.price;
            }
            // Check for 39 match
            if (bedSize === '39' && condition.bedSize === '39') {
                return condition.price;
            }
        }
        return null; // No matching price found
    }

    // Handle PriceCondition array (accessories, delivery, etc.)
    if (option.PriceCondition) {
        for (let condition of option.PriceCondition) {
            const showFor = condition.ShowforBedSize || condition.BedSize;

            // Check for exact match
            if (showFor === bedSize) {
                return condition.price;
            }

            // Handle "39 or 48" type conditions
            if (showFor && showFor.includes('or')) {
                const sizes = showFor.split(' or ').map(s => s.trim());
                if (sizes.includes(bedSize)) {
                    return condition.price;
                }
            }

            // Handle "78(King)" matching "78"
            if (showFor === '78' && bedSize === '78(King)') {
                return condition.price;
            }
        }
    }

    // Handle price array (for q2-bed finish options)
    if (Array.isArray(option.price)) {
        for (let priceObj of option.price) {
            for (let key in priceObj) {
                if (key.includes(bedSize.replace('(King)', ''))) {
                    return priceObj[key];
                }
            }
        }
    }

    return null;
}

// Get the current image to display based on selections
function getCurrentQuestionImage(question) {
    // If image is an array with conditions, evaluate them
    if (Array.isArray(question.image)) {
        const bedSize = getSelectedBedSize();
        const fallRisk = state.answers['q4']; // Get fall risk answer

        for (let imageCondition of question.image) {
            const condition = imageCondition.showIf.toLowerCase();

            // Check bed size conditions
            if (condition.includes('bed size')) {
                // Handle "bed size is 39 or 78"
                if (condition.includes('39 or 78') || condition.includes('39 or 48')) {
                    const sizes = condition.match(/\d+/g); // Extract numbers
                    if (sizes && sizes.includes(bedSize ? bedSize.replace('(King)', '') : '')) {
                        return imageCondition['img-url'];
                    }
                }
                // Handle "bed size 48" or "bed size selected 78"
                else if (condition.includes('48') && bedSize === '48') {
                    return imageCondition['img-url'];
                }
                else if (condition.includes('78') && bedSize === '78(King)') {
                    return imageCondition['img-url'];
                }
                else if (condition.includes('39') && bedSize === '39') {
                    return imageCondition['img-url'];
                }
            }

            // Check combined conditions (bed size + risk level)
            if (condition.includes('mid-high risk') || condition.includes('high risk')) {
                const isHighRisk = fallRisk === 'safety-acc-yes';

                if (isHighRisk) {
                    // Check if bed size also matches
                    if (condition.includes('78') && bedSize === '78(King)') {
                        return imageCondition['img-url'];
                    }
                    else if ((condition.includes('39 or 48')) && (bedSize === '39' || bedSize === '48')) {
                        return imageCondition['img-url'];
                    }
                    else if (!condition.includes('bed size')) {
                        // If only risk level is mentioned, return this image
                        return imageCondition['img-url'];
                    }
                }
            }
        }

        // If no condition matches, return first image as fallback
        return question.image[0] ? question.image[0]['img-url'] : '';
    }

    // If image is a simple string, return it
    if (typeof question.image === 'string') {
        return question.image;
    }

    return '';
}

// Render a specific question
function renderQuestion(visibleIndex) {
    const actualIndex = state.visibleQuestions[visibleIndex];
    const question = quizData.questions[actualIndex];

    if (!question) return;

    // Get the appropriate image for this question
    const questionImage = getCurrentQuestionImage(question);

    let html = `
        <div class="question-card active" data-question-id="${question.id}">
            <div class="question-header">
                <h2 class="question-title">${question.question}</h2>
                ${questionImage ? `<img src="${questionImage}" alt="Question image" class="question-image" onerror="this.style.display='none'" id="question-image-${question.id}">` : ''}
                ${question.qinfo ? `<div class="question-info-wrapper"><div class="question-info collapsed" id="qinfo-${question.id}">${question.qinfo}</div>
                <span class="see-more-toggle" id="toggle-${question.id}" onclick="toggleQuestionInfo('${question.id}')">See More</span></div>` : ''}
            </div>
            
            <div class="options-container">
    `;

    // Determine if this is a multi-select question (checkboxes) or single select (radio)
    const isMultiSelect = question.type === 'multi';
    const inputType = isMultiSelect ? 'checkbox' : 'radio';
    const inputName = question.id;

    // Store whether this question allows multiple selections
    question.isMultiSelect = isMultiSelect;

    // Filter options based on conditions
    let visibleOptions = question.options.filter(opt => shouldShowOption(opt, question));

    visibleOptions.forEach(option => {
        const shouldPreSelect = shouldPreSelectOption(option, question);

        // If should pre-select and not already selected, add to answers
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

    html += `
            </div>
    `;

    // Add skip button for multi-select questions
    if (isMultiSelect) {
        html += `
            <div style="text-align: center; margin-top: 20px;">
                <button class="skip-button" onclick="skipQuestion('${question.id}')" style="
                    padding: 10px 24px;
                    background: transparent;
                    color: #25385b;
                    border: 2px solid #25385b;
                    border-radius: 8px;
                    font-size: 1em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='transparent'">
                    Skip - No accessories needed
                </button>
            </div>
        `;
    }

    html += `
            ${question['option-desc'] ? `<div class="option-description">${question['option-desc']}</div>` : ''}
        </div>
    `;

    quizContainer.innerHTML = html;

    //styling for question 8
    let screenWidth = window.innerWidth;

    if (screenWidth >= 1100 && actualIndex == 8) {
        document.querySelector('#question-image-q8').style.width = '45%';
    }

}



// Skip question function
function skipQuestion(questionId) {
    // Clear any selections for this question
    state.answers[questionId] = [];

    // Move to next question
    goToNextQuestion();
}

// Handle option change
function handleOptionChange(questionId, optionId, isMultiSelect) {
    if (isMultiSelect) {
        // Handle checkbox (multiple selections)
        if (!state.answers[questionId]) {
            state.answers[questionId] = [];
        }

        const index = state.answers[questionId].indexOf(optionId);
        if (index > -1) {
            // Remove if already selected
            state.answers[questionId].splice(index, 1);
        } else {
            // Add if not selected
            state.answers[questionId].push(optionId);
        }
    } else {
        // Handle radio button (single selection)
        state.answers[questionId] = optionId;

        // If this is q1, store bed size and rebuild visible questions
        if (questionId === 'q1') {
            state.selectedBedSize = getSelectedBedSize();
            buildVisibleQuestionsList();
            // Re-render to update images that depend on bed size
            updateConditionalImages();
        }

        // If this is q4 (fall risk), update images and clear/update pre-selections
        if (questionId === 'q4') {
            updateConditionalImages();

            // Clear any previous pre-selections in Q6 to start fresh
            if (state.answers['q6']) {
                // Keep only user-selected items (not auto-selected ones)
                // We'll re-apply the logic when Q6 renders
                state.answers['q6'] = state.answers['q6'].filter(
                    id => id !== 'Additional-rails' && id !== 'underbed-light'
                );
            }
        }


        // If this is q9, rebuild questions to show/hide q10
        if (questionId === 'q10') {
            buildVisibleQuestionsList();
        }
    }

    updateNavigationButtons();
}

// Update images that depend on conditional logic
function updateConditionalImages() {
    const actualIndex = state.visibleQuestions[state.currentQuestionIndex];
    const question = quizData.questions[actualIndex];

    const imageElement = document.getElementById(`question-image-${question.id}`);
    if (!imageElement) return;

    // Get the new image based on current selections
    const newImage = getCurrentQuestionImage(question);
    if (newImage && newImage !== imageElement.src) {
        imageElement.src = newImage;
    }
}



// Go to next question
function goToNextQuestion() {
    // Check if current question is answered
    const actualIndex = state.visibleQuestions[state.currentQuestionIndex];
    const currentQuestion = quizData.questions[actualIndex];

    if (!isQuestionAnswered(currentQuestion)) {
        alert('Please select an option before continuing.');
        return;
    }

    // Check if we're at the last question
    if (state.currentQuestionIndex >= state.visibleQuestions.length - 1) {
        showResults();
        return;
    }

    state.currentQuestionIndex++;
    renderQuestion(state.currentQuestionIndex);
    updateProgressBar();
    updateNavigationButtons();
    updateSectionInfo();

    // Scroll to top of quiz container
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Go to previous question
function goToPreviousQuestion() {
    if (state.currentQuestionIndex <= 0) return;

    state.currentQuestionIndex--;
    renderQuestion(state.currentQuestionIndex);
    updateProgressBar();
    updateNavigationButtons();
    updateSectionInfo();

    // Scroll to top of quiz container
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Check if a question is answered
function isQuestionAnswered(question) {
    const answer = state.answers[question.id];

    if (question.isMultiSelect) {
        // Multi-select is optional - can skip or select items
        return true;
    } else {
        // Single select requires an answer
        return answer && answer !== '';
    }
}

// Update progress bar
function updateProgressBar() {
    const progress = ((state.currentQuestionIndex + 1) / state.visibleQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Update navigation buttons
function updateNavigationButtons() {
    // Previous button
    prevBtn.disabled = state.currentQuestionIndex === 0;

    // Next button
    const actualIndex = state.visibleQuestions[state.currentQuestionIndex];
    const currentQuestion = quizData.questions[actualIndex];
    const isAnswered = isQuestionAnswered(currentQuestion);

    nextBtn.disabled = !isAnswered;

    // Change text on last question
    if (state.currentQuestionIndex >= state.visibleQuestions.length - 1) {
        nextBtn.textContent = 'See Results →';
    } else {
        // nextBtn.textContent = 'Next →';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    }
}

// Update section info
function updateSectionInfo() {
    const actualIndex = state.visibleQuestions[state.currentQuestionIndex];
    const question = quizData.questions[actualIndex];

    const currentNum = state.currentQuestionIndex + 1;
    // sectionNumber.textContent = currentNum;
    sectionNumber.textContent = question['section-number'];

    // Use section text from question if available
    if (question['section-text']) {
        sectionText.textContent = question['section-text'];
    } else {
        // Fallback to default logic
        if (currentNum <= 3) {
            sectionText.textContent = 'Size & Style';
        } else if (currentNum <= 5) {
            sectionText.textContent = 'User Needs';
        } else if (currentNum <= 8) {
            sectionText.textContent = 'Accessories & Bedding';
        } else {
            sectionText.textContent = 'Delivery & Timing';
        }
    }
}

//see more toggle

function toggleQuestionInfo(questionId) {
    const infoElement = document.getElementById(`qinfo-${questionId}`);
    const toggleButton = document.getElementById(`toggle-${questionId}`);

    if (infoElement.classList.contains('collapsed')) {
        infoElement.classList.remove('collapsed');
        infoElement.classList.add('expanded');
        toggleButton.innerHTML = 'See Less';
    } else {
        infoElement.classList.remove('expanded');
        infoElement.classList.add('collapsed');
        toggleButton.innerHTML = 'See More';
    }
}


//Generate Quote Number
function generateQuoteNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = String(Math.floor(100 + Math.random() * 900));

    return `SC-${year}${month}${day}-${random}`;
}


// Show results
function showResults() {
    quizContainer.style.display = 'none';
    navigationContainer.style.display = 'none';
    resultsContainer.classList.add('active');

    //Generate unique quote number
    state.quoteNumber = generateQuoteNumber();

    // Generate results summary
    generateResultsSummary();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Generate results summary
function generateResultsSummary() {
    const summaryContainer = document.getElementById('resultsSummary');
    let html = `<h3 style="color: #25385b; margin-bottom: 20px;">Quote Number: ${state.quoteNumber}</h3>`;

    // Add table for 3-column layout
    html += `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
                <tr style="background: #f5f5f5; border-bottom: 2px solid #25385b;">
                    <th style="padding: 12px; text-align: left; font-weight: 600; color: #25385b;">Item</th>
                    <th style="padding: 12px; text-align: left; font-weight: 600; color: #25385b;">Selection</th>
                    <th style="padding: 12px; text-align: right; font-weight: 600; color: #25385b;">Price</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalPrice = 0;

    // Go through each visible question and show the answer with price
    state.visibleQuestions.forEach(questionIndex => {
        const question = quizData.questions[questionIndex];
        const answer = state.answers[question.id];

        // Always show multi-select questions (accessories/bedding)
        if (question.isMultiSelect || answer) {

            if (Array.isArray(answer) && answer.length > 0) {
                // Multi-select answer - show each item with price in separate rows
                answer.forEach(id => {
                    const option = question.options.find(opt => opt.id === id);
                    if (option) {
                        const price = getOptionPrice(option);
                        const priceNum = price && price !== '0' ? parseFloat(price.replace(/,/g, '')) : 0;
                        totalPrice += priceNum;

                        html += `
                            <tr style="border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 12px; color: #666;">${question.question}</td>
                                <td style="padding: 12px; font-weight: 500;">${option.label}</td>
                                <td style="padding: 12px; text-align: right; color: #C3AB74; font-weight: 600;">
                                    ${price && price !== '0' ? '$' + price : '—'}
                                </td>
                            </tr>
                        `;
                    }
                });
            } else if (answer && !Array.isArray(answer)) {
                // Single select answer
                const option = question.options.find(opt => opt.id === answer);
                if (option) {
                    let price = getOptionPrice(option);
                    let priceNum = 0;

                    // Get bed name if this is q2-bed or q2-headboard
                    let selectionText = option.label;

                    // SPECIAL HANDLING FOR Q1 (BED WIDTH)
                    if (question.id === 'q1') {
                        const q2bed = quizData.questions.find(q => q.id === 'q2-bed');
                        const q2headboard = quizData.questions.find(q => q.id === 'q2-headboard');

                        let bedName = '';
                        let bedPrice = null;

                        // Get bed name AND price from Q2
                        if (state.answers['q2-bed']) {
                            const bedOption = q2bed?.options.find(opt => opt.id === state.answers['q2-bed']);
                            if (bedOption) {
                                if (bedOption.SelectedBed) {
                                    bedName = ` (${bedOption.SelectedBed})`;
                                }
                                // GET THE PRICE FROM Q2-BED
                                bedPrice = getOptionPrice(bedOption);
                            }
                        } else if (state.answers['q2-headboard']) {
                            const headboardOption = q2headboard?.options.find(opt => opt.id === state.answers['q2-headboard']);
                            if (headboardOption) {
                                bedName = ' (Split King)';
                                // GET THE PRICE FROM Q2-HEADBOARD
                                bedPrice = getOptionPrice(headboardOption);
                            }
                        }

                        selectionText = option.label + bedName;

                        // USE BED PRICE FROM Q2 instead of Q1 price
                        if (bedPrice) {
                            price = bedPrice;
                        }
                    }
                    // SPECIAL HANDLING FOR Q2 (FINISH) - NO PRICE
                    else if (question.id === 'q2-bed' || question.id === 'q2-headboard') {
                        if (option.SelectedBed) {
                            selectionText = `${option.SelectedBed} - ${option.label}`;
                        }
                        // DON'T show price on Q2 line (it's already on Q1)
                        price = null;
                    }

                    // Calculate total
                    if (price && price !== '0') {
                        priceNum = parseFloat(price.replace(/,/g, ''));
                        totalPrice += priceNum;
                    }

                    html += `
                        <tr style="border-bottom: 1px solid #e0e0e0;">
                            <td style="padding: 12px; color: #666;">${question.question}</td>
                            <td style="padding: 12px; font-weight: 500;">${selectionText}</td>
                            <td style="padding: 12px; text-align: right; color: #C3AB74; font-weight: 600;">
                                ${price && price !== '0' ? '$' + price : '—'}
                            </td>
                        </tr>
                    `;
                }
            } else if (question.isMultiSelect) {
                // Show "None selected" for empty multi-select
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

    // Add subtotal
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



// Handle contact option click
function handleContactOptionClick(e) {
    const option = e.currentTarget;
    const contactType = option.getAttribute('data-contact-type');

    // Remove active class from all options
    document.querySelectorAll('.contact-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Add active class to clicked option
    option.classList.add('selected');

    // Hide all forms
    document.getElementById('emailForm').classList.remove('active');
    document.getElementById('phoneForm').classList.remove('active');
    document.getElementById('successMessage').classList.remove('active');

    // Show appropriate form
    if (contactType === 'email') {
        document.getElementById('emailForm').classList.add('active');
    } else if (contactType === 'phone') {
        document.getElementById('phoneForm').classList.add('active');
    }

    state.contactType = contactType;
}

// Handle email form submission
function handleEmailSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('emailInput').value;
    const name = document.getElementById('nameInput').value;
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
        notes: notes,
        answers: state.answers,
        bedSize: state.selectedBedSize,
        timestamp: new Date().toISOString()
    };

    // WordPress AJAX - NO nonce needed for public forms
    const formData = new FormData();
    formData.append('action', 'submit_bed_selector');
    formData.append('data', JSON.stringify(submissionData));
    // REMOVED: formData.append('nonce', bedSelectorData.nonce);
    
    // Disable submit button
    const submitBtn = document.getElementById('submitEmail');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Use direct path to admin-ajax.php
    fetch('/wp-admin/admin-ajax.php', {  // ← CHANGED FROM bedSelectorData.ajaxUrl
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

// Handle phone form submission
function handlePhoneSubmit(e) {
    e.preventDefault();
    
    const phone = document.getElementById('phoneInput').value;
    const name = document.getElementById('phoneNameInput').value;
    const bestTime = document.getElementById('bestTimeInput').value;
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
        bestTime: bestTime,
        notes: notes,
        answers: state.answers,
        bedSize: state.selectedBedSize,
        timestamp: new Date().toISOString()
    };
    
    // WordPress AJAX - NO nonce needed for public forms
    const formData = new FormData();
    formData.append('action', 'submit_bed_selector');
    formData.append('data', JSON.stringify(submissionData));
    // REMOVED: formData.append('nonce', bedSelectorData.nonce);
    
    // Disable submit button
    const submitBtn = document.getElementById('submitPhone');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    // Use direct path to admin-ajax.php
    fetch('/wp-admin/admin-ajax.php', {  // ← CHANGED FROM bedSelectorData.ajaxUrl
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


// Initialize when DOM is ready

document.addEventListener('DOMContentLoaded', initQuiz);
