/**
 * AnnaMitra (अन्नमित्र) - Trilingual Dictionary & i18n Engine
 * Supports: Marathi (mr), Hindi (hi), English (en)
 */

const i18n = {
    mr: {
        // App Title & Nav
        appTitle: 'अन्नमित्र',
        appSubtitle: 'स्मार्ट सार्वजनिक वितरण प्रणाली (महाराष्ट्र शासन)',
        portalCitizen: 'नागरिक पोर्टल',
        portalShopkeeper: 'दुकानदार पोर्टल',
        portalAdmin: 'प्रशासकीय नियंत्रण कक्ष',
        roleCitizen: 'नागरिक / कुटुंब',
        roleShopkeeper: 'रास्त भाव दुकानदार',
        roleAdmin: 'अन्न व नागरी पुरवठा अधिकारी',
        audioAssistant: 'ध्वनी सहाय्यक',
        audioOn: 'ध्वनी चालू',
        audioOff: 'ध्वनी बंद',
        switchLanguage: 'भाषा बदला',
        logout: 'लॉगआउट 🚪',
        backToHome: '← मुख्य पृष्ठावर जा',
        
        // Homepage Hero & Role Chooser
        heroTag: 'महाराष्ट्र शासन • सार्वजनिक वितरण प्रणाली',
        heroTitle: 'स्मार्ट सार्वजनिक वितरण प्रणाली',
        heroSubtitle: 'महाराष्ट्रातील प्रत्येक पात्र कुटुंबाला पारदर्शक, जलद व हक्काचे धान्य वाटप करण्याची आधुनिक डिजिटल प्रणाली.',
        exploreServicesBtn: '🚀 सेवा सुरू करा',
        whoAreYouTitle: 'तुम्ही कोण आहात? निवडा',
        whoAreYouSubtitle: 'आपल्या भूमिकेनुसार खालील योग्य पोर्टल निवडा:',
        roleCardCitizenTitle: 'नागरिक / कार्डधारक',
        roleCardCitizenDesc: 'तुमचा रेशन कोटा तपासा, गर्दी टाळण्यासाठी ३ वेळेचे टोकन बुक करा आणि डिजिटल पासबुक पहा.',
        roleCardShopkeeperTitle: 'रास्त भाव दुकानदार',
        roleCardShopkeeperDesc: 'टोकन व OTP द्वारे धान्य वाटप करा, साठा तपासा आणि नवीन कुटुंब सदस्य नोंदणी करा.',
        roleCardAdminTitle: 'शासकीय अधिकारी कक्ष',
        roleCardAdminDesc: 'थेट राज्यभरातील साठा मॉनिटरिंग, AI संशयित व्यवहार शोध व नागरिक तक्रार निवारण.',
        
        // Login Forms (Screenshot #1)
        loginCitizenHeading: 'नागरिक लॉगिन',
        loginCitizenSub: 'आपले रेशन, कुटुंब आणि दुकान तपशील पाहण्यासाठी लॉगिन करा',
        loginShopkeeperHeading: 'दुकानदार लॉगिन',
        loginShopkeeperSub: 'रास्त भाव दुकान कार्यप्रणालीमध्ये प्रवेश करा',
        loginAdminHeading: 'प्रशासकीय अधिकारी लॉगिन',
        loginAdminSub: 'अन्न व नागरी पुरवठा नियंत्रण कक्षात प्रवेश करा',
        inputRationCardNo: 'रेशन कार्ड नंबर',
        inputPassword: 'पासवर्ड / ४-अंकी पिन',
        inputFpsId: 'दुकानदार FPS आयडी',
        inputOfficerId: 'अधिकारी आयडी',
        loginBtn: '✅ लॉगिन करा',
        noAccountNotice: 'नवीन नोंदणीसाठी जवळच्या रास्त भाव दुकानात संपर्क साधा.',

        // General Badges & Actions
        available: 'उपलब्ध',
        booked: 'टोकन बुक झाले',
        collected: 'रेशन घेतले',
        confirmed: 'मंजूर',
        pending: 'प्रलंबित',
        critical: 'तातडीचे',
        kg: 'कि.ग्रॅ.',
        litre: 'लिटर',
        rupees: '₹',
        free: 'मोफत (₹०)',
        close: 'बंद करा',
        cancel: 'रद्द करा',
        confirm: 'खात्री करा',
        downloadReceipt: 'पावती डाउनलोड करा',
        printReceipt: 'पावती प्रिंट करा',
        helpLine: 'टोल फ्री मदत क्रमांक: १८००-२२-४९५०',

        // Citizen Portal
        citizenWelcome: 'नमस्कार,',
        rationCardNo: 'रेशन कार्ड क्र.:',
        cardType: 'कार्ड प्रकार:',
        assignedFps: 'आपले अधिकृत रेशन दुकान:',
        viewShopStock: 'दुकान साठा तपासा',
        
        // Quota Section
        myMonthlyQuota: 'ऑगस्ट २०२६ चे तुमचे हक्काचे धान्य',
        quotaSubtitle: 'खालील सर्व धान्य तुमच्या कुटुंबासाठी मंजूर झालेले आहे. कोणालाही जादा पैसे देऊ नका!',
        rice: 'तांदूळ',
        wheat: 'गहू',
        sugar: 'साखर',
        oil: 'खाद्यतेल',
        totalPayable: 'एकूण देय रक्कम:',
        
        // Slot Booking Section
        bookSlotTitle: 'रेशन आणण्यासाठी वेळ (टोकन) निवडा',
        bookSlotDesc: 'रांगेत उभे राहण्याची गरज नाही! खालील ३ वेळेपैकी सोयीची वेळ निवडून हिरवे बटण दाबा.',
        slot1Title: 'सकाळचे सत्र (१०:०० ते १२:००)',
        slot2Title: 'दुपारचे सत्र (१२:०० ते ०२:००)',
        slot3Title: 'संध्याकाळचे सत्र (०४:०० ते ०८:००)',
        spotsRemaining: 'जागा शिल्लक',
        bookNowBtn: 'हे टोकन बुक करा 🎫',
        alreadyBooked: 'तुमचे टोकन सक्रिय आहे',
        
        // Active Token Card
        activeTokenTitle: 'तुमचे रेशन टोकन पास',
        tokenNo: 'टोकन क्रमांक',
        assignedTime: 'निश्चित वेळ',
        validDate: 'तारीख',
        secureOtp: 'सुरक्षित पडताळणी OTP',
        otpInstruction: 'हा ४-अंकी गुप्त कोड धान्य घेतानाच दुकानदाराला द्या. आधी कधीही देऊ नका!',
        currentServing: 'सध्या दुकानात चालू टोकन:',
        yourTurnIn: 'तुमचा नंबर अंदाजे:',
        cancelTokenBtn: 'टोकन रद्द करा ❌',
        
        // Anti-Corruption SOS
        sosTitle: 'दुकानदाराने रेशन देण्यास नकार दिला का?',
        sosDesc: 'जर दुकानदार म्हणाला "माल संपला आहे" किंवा जादा पैसे मागितले, तर तात्काळ हे लाल बटण दाबा!',
        sosBtn: '🚨 रेशन नाकारले? तक्रार नोंदवा',
        sosModalTitle: 'तातडीची तक्रार (अन्न निरीक्षक थेट दखल)',
        sosReason1: 'दुकानदाराने माल संपल्याचे खोटे सांगितले',
        sosReason2: 'शासकीय दरापेक्षा जादा पैसे मागितले',
        sosReason3: 'वजन कमी दिले / निकृष्ट धान्य दिले',
        sosReason4: 'दुकान वेळेत उघडे नव्हते',
        sosSubmitBtn: 'तातडीने कारवाईची मागणी करा',
        
        // Family Details
        familyTitle: 'रेशन कार्डातील कुटुंब सदस्य',
        aadhaarLinked: 'आधार जोडलेले आहे ✅',
        aadhaarPending: 'आधार जोडणी बाकी ⚠️',

        // Digital Passbook
        passbookTitle: 'डिजिटल रेशन पासबुक (मागील पावत्या)',
        passbookDesc: 'गेल्या काही महिन्यात तुम्ही घेतलेल्या धान्याची संपूर्ण पारदर्शक नोंद.',
        receiptNo: 'पावती क्र.:',
        dateOfClaim: 'तारीख व वेळ:',
        collectedItems: 'मिळालेले धान्य:',
        verifiedBy: 'पडताळणी प्रकार:',
        
        // Shopkeeper Portal
        fpsPortalTitle: 'रास्त भाव दुकानदार कार्यप्रणाली',
        fpsSubtitle: 'डिजिटल पडताळणी, पारदर्शक साठा नियंत्रण व कुटुंब सदस्य नोंदणी',
        scannerTitle: 'नागरिक टोकन व OTP पडताळणी',
        enterCardOrToken: 'नागरिकाचा रेशन कार्ड नंबर किंवा टोकन नंबर टाका',
        searchBeneficiary: 'तपासा 🔍',
        beneficiaryDetails: 'लाभार्थी तपशील',
        deliverGrainBtn: 'धान्य वाटप निश्चित करा व पावती द्या ✅',
        enterOtpToConfirm: 'नागरिकाचा ४-अंकी OTP प्रविष्ट करा',
        
        // Add Family Member Section
        addNewMemberTitle: 'नवीन कुटुंब सदस्य जोडा (रेशन कार्ड अपडेट)',
        addNewMemberDesc: 'नवीन जन्मलेले बाळ किंवा लग्न होऊन आलेल्या सदस्याचे नाव रेशन कार्डात जोडा:',
        inputMemberName: 'सदस्याचे पूर्ण नाव',
        inputMemberRelation: 'नाते',
        inputMemberAge: 'वय (वर्षे)',
        inputMemberGender: 'लिंग',
        inputMemberAadhaar: '१२-अंकी आधार क्रमांक',
        saveNewMemberBtn: 'सदस्य जोडा व कोटा अपडेट करा ➕',
        
        // Shop Stock Ledger (Immutable)
        shopLedgerTitle: 'अधिकृत शासकीय साठा नोंदवही (स्वयंचलित)',
        shopLedgerNotice: 'टीप: हा साठा गोदामातून आलेल्या चलनानुसार स्वयंचलित मोजला जातो. दुकानदारास स्वतः बदल करण्याची मुभा नाही.',
        fciDispatched: 'शासकीय गोदामातून प्राप्त',
        distributedToday: 'आजवर वितरित झालेले',
        balanceInShop: 'दुकानात शिल्लक साठा',
        reportStockDamage: 'खराब धान्याची तपासणी नोंदवा ⚠️',
        
        // Admin Command Center
        adminTitle: 'राज्य अन्न व नागरी पुरवठा नियंत्रण कक्ष',
        adminSubtitle: 'थेट रियल-टाइम मॉनिटरिंग, AI संशयित व्यवहार शोध व तक्रार निवारण',
        statTotalFps: 'एकूण सक्रिय दुकाने',
        statBeneficiaries: 'नोंदणीकृत लाभार्थी कुटुंब',
        statDistributedMT: 'वितरित धान्य (मेट्रिक टन)',
        statActiveGrievances: 'सक्रिय नागरिक तक्रारी',
        aiFraudDetection: '🤖 AI गैरप्रकार व अनियमितता रडार',
        grievanceDesk: 'तातडीचे नागरिक SOS व निवारण कक्ष',
        resolveBtn: 'कारवाई पूर्ण करा',

        // Direct Citizen-to-Gov Query
        queryDeskTitle: '💬 थेट शासकीय मदत व शंका निवारण',
        queryDeskSub: 'आपले रेशन कार्ड, धान्य कोटा किंवा योजनेबाबत थेट अन्न व नागरी पुरवठा विभागाकडे प्रश्न विचारा.',
        queryCategory: 'चौकशीचा विषय निवडा',
        queryCategoryMember: '🏷️ रेशन कार्ड नाव / सदस्य बदल चौकशी',
        queryCategoryQuota: '⚖️ धान्य कोटा व सवलत दर माहिती',
        queryCategoryShop: '📍 रेशन दुकान स्थलांतर विनंती',
        queryCategoryScheme: '📜 अंत्योदय / प्राधान्य कुटुंब पात्रता',
        queryCategoryGeneral: '❓ सर्वसाधारण शासकीय मदत व चौकशी',
        querySubject: 'विषय (थोडक्यात)',
        queryMessage: 'आपला प्रश्न / समस्या सविस्तर लिहा',
        submitQueryBtn: 'शासनाला प्रश्न पाठवा 🚀',
        myQueriesTitle: '📋 माझे विचारलेले प्रश्न व शासकीय उत्तरे',
        adminQueryTitle: '📬 थेट नागरिक प्रश्न व शंका निवारण डेस्क',
        adminQuerySubtitle: 'नागरिकांनी विचारलेल्या सर्व प्रश्नांची थेट यादी व अधिकृत मार्गदर्शन निवारण कक्ष',
        replyBtn: 'अधिकृत उत्तर पाठवा ✍️'
    },
    hi: {
        appTitle: 'अन्नमित्र',
        appSubtitle: 'स्मार्ट सार्वजनिक वितरण प्रणाली (महाराष्ट्र शासन)',
        portalCitizen: 'नागरिक पोर्टल',
        portalShopkeeper: 'दुकानदार पोर्टल',
        portalAdmin: 'प्रशासनिक नियंत्रण कक्ष',
        roleCitizen: 'नागरिक / परिवार',
        roleShopkeeper: 'उचित मूल्य दुकानदार',
        roleAdmin: 'खाद्य एवं नागरिक आपूर्ति अधिकारी',
        audioAssistant: 'ध्वनि सहायक',
        audioOn: 'ध्वनि चालू',
        audioOff: 'ध्वनि बंद',
        switchLanguage: 'भाषा बदलें',
        logout: 'लॉगआउट 🚪',
        backToHome: '← मुख्य पृष्ठ पर जाएं',

        heroTag: 'महाराष्ट्र शासन • सार्वजनिक वितरण प्रणाली',
        heroTitle: 'स्मार्ट सार्वजनिक वितरण प्रणाली',
        heroSubtitle: 'महाराष्ट्र के प्रत्येक पात्र परिवार को पारदर्शी, त्वरित और समयबद्ध राशन वितरण।',
        exploreServicesBtn: '🚀 सेवाएं शुरू करें',
        whoAreYouTitle: 'आप कौन हैं? चुनें',
        whoAreYouSubtitle: 'अपनी भूमिका के अनुसार उचित पोर्टल चुनें:',
        roleCardCitizenTitle: 'नागरिक / कार्डधारक',
        roleCardCitizenDesc: 'अपना राशन कोटा देखें, भीड़ से बचने के लिए ३ समय स्लॉट में टोकन बुक करें।',
        roleCardShopkeeperTitle: 'उचित मूल्य दुकानदार',
        roleCardShopkeeperDesc: 'टोकन व OTP द्वारा राशन वितरण करें, स्टॉक देखें और नए सदस्य जोड़ें।',
        roleCardAdminTitle: 'शासकीय अधिकारी कक्ष',
        roleCardAdminDesc: 'राज्यव्यापी स्टॉक मॉनिटरिंग, AI फ्रॉड डिटेक्शन और शिकायत निवारण।',

        loginCitizenHeading: 'नागरिक लॉगिन',
        loginCitizenSub: 'अपना राशन, परिवार और दुकान विवरण देखने के लिए लॉगिन करें',
        loginShopkeeperHeading: 'दुकानदार लॉगिन',
        loginShopkeeperSub: 'उचित मूल्य दुकान प्रणाली में प्रवेश करें',
        loginAdminHeading: 'प्रशासनिक अधिकारी लॉगिन',
        loginAdminSub: 'खाद्य एवं आपूर्ति कमान केंद्र में प्रवेश करें',
        inputRationCardNo: 'राशन कार्ड नंबर',
        inputPassword: 'पासवर्ड / ४-अंकीय पिन',
        inputFpsId: 'दुकानदार FPS आईडी',
        inputOfficerId: 'अधिकारी आईडी',
        loginBtn: '✅ लॉगिन करें',
        noAccountNotice: 'नए पंजीकरण के लिए नजदीकी राशन दुकान से संपर्क करें।',

        available: 'उपलब्ध',
        booked: 'टोकन बुक हुआ',
        collected: 'राशन प्राप्त किया',
        confirmed: 'स्वीकृत',
        pending: 'लंबित',
        critical: 'अति-महत्वपूर्ण',
        kg: 'कि.ग्रा.',
        litre: 'लीटर',
        rupees: '₹',
        free: 'मुफ्त (₹०)',
        close: 'बंद करें',
        cancel: 'रद्द करें',
        confirm: 'पुष्टि करें',
        downloadReceipt: 'रसीद डाउनलोड करें',
        printReceipt: 'रसीद प्रिंट करें',
        helpLine: 'टोल फ्री सहायता नंबर: १८००-२२-४९५०',

        citizenWelcome: 'नमस्ते,',
        rationCardNo: 'राशन कार्ड नं.:',
        cardType: 'कार्ड प्रकार:',
        assignedFps: 'आपकी अधिकृत राशन दुकान:',
        viewShopStock: 'दुकान का स्टॉक देखें',
        
        myMonthlyQuota: 'अगस्त २०२६ का आपका अधिकारिक राशन',
        quotaSubtitle: 'यह पूरा अनाज आपके परिवार के लिए स्वीकृत है। किसी को भी अतिरिक्त पैसे न दें!',
        rice: 'चावल',
        wheat: 'गेहूं',
        sugar: 'चीनी',
        oil: 'खाद्य तेल',
        totalPayable: 'कुल देय राशि:',
        
        bookSlotTitle: 'राशन लेने के लिए समय (टोकन) चुनें',
        bookSlotDesc: 'अब लाइन में खड़े होने की जरूरत नहीं! नीचे दिए गए ३ समय में से अपनी सुविधा अनुसार चुनें।',
        slot1Title: 'सुबह का समय (१०:०० से १२:००)',
        slot2Title: 'दोपहर का समय (१२:०० से ०२:००)',
        slot3Title: 'शाम का समय (०४:०० से ०८:००)',
        spotsRemaining: 'स्थान शेष',
        bookNowBtn: 'यह टोकन बुक करें 🎫',
        alreadyBooked: 'आपका टोकन सक्रिय है',
        
        activeTokenTitle: 'आपका राशन टोकन पास',
        tokenNo: 'टोकन नंबर',
        assignedTime: 'निर्धारित समय',
        validDate: 'तारीख',
        secureOtp: 'सुरक्षित सत्यापन OTP',
        otpInstruction: 'यह ४-अंकों का गुप्त कोड केवल राशन प्राप्त करते समय दुकानदार को बताएं।',
        currentServing: 'दुकान में चल रहा टोकन:',
        yourTurnIn: 'आपकी बारी लगभग:',
        cancelTokenBtn: 'टोकन रद्द करें ❌',
        
        sosTitle: 'क्या दुकानदार ने राशन देने से मना किया?',
        sosDesc: 'यदि दुकानदार कहे कि "राशन खत्म हो गया" या ज्यादा पैसे मांगे, तो तुरंत लाल बटन दबाएं!',
        sosBtn: '🚨 राशन नहीं मिला? शिकायत दर्ज करें',
        sosModalTitle: 'आपातकालीन शिकायत (खाद्य निरीक्षक तुरंत कार्रवाई)',
        sosReason1: 'दुकानदार ने स्टॉक खत्म होने का झूठा बहाना बनाया',
        sosReason2: 'सरकारी दर से ज्यादा पैसे मांगे',
        sosReason3: 'कम वजन दिया / खराब अनाज दिया',
        sosReason4: 'दुकान समय पर नहीं खुली थी',
        sosSubmitBtn: 'तुरंत कार्रवाई का अनुरोध करें',
        
        familyTitle: 'राशन कार्ड में जुड़े परिवार के सदस्य',
        aadhaarLinked: 'आधार जुड़ा हुआ है ✅',
        aadhaarPending: 'आधार जोड़ना बाकी है ⚠️',

        passbookTitle: 'डिजिटल राशन पासबुक (पिछली रसीदें)',
        passbookDesc: 'पिछले महीनों में प्राप्त राशन का पूरा पारदर्शी हिसाब-किताब।',
        receiptNo: 'रसीद सं.:',
        dateOfClaim: 'तारीख एवं समय:',
        collectedItems: 'प्राप्त अनाज:',
        verifiedBy: 'सत्यापन प्रकार:',
        
        fpsPortalTitle: 'उचित मूल्य दुकानदार कार्यप्रणाली',
        fpsSubtitle: 'डिजिटल सत्यापन, पारदर्शी स्टॉक नियंत्रण एवं सदस्य पंजीकरण',
        scannerTitle: 'नागरिक टोकन एवं OTP सत्यापन',
        enterCardOrToken: 'नागरिक का राशन कार्ड नंबर या टोकन नंबर दर्ज करें',
        searchBeneficiary: 'खोजें 🔍',
        beneficiaryDetails: 'लाभार्थी विवरण',
        deliverGrainBtn: 'अनाज वितरण की पुष्टि करें और रसीद दें ✅',
        enterOtpToConfirm: 'नागरिक का ४-अंकीय OTP दर्ज करें',
        
        addNewMemberTitle: 'नया परिवार सदस्य जोड़ें (राशन कार्ड अपडेट)',
        addNewMemberDesc: 'परिवार में नए सदस्य का नाम राशन कार्ड में जोड़ें:',
        inputMemberName: 'सदस्य का पूरा नाम',
        inputMemberRelation: 'संबंध',
        inputMemberAge: 'आयु (वर्ष)',
        inputMemberGender: 'लिंग',
        inputMemberAadhaar: '१२-अंकीय आधार नंबर',
        saveNewMemberBtn: 'सदस्य जोड़ें और कोटा अपडेट करें ➕',

        shopLedgerTitle: 'आधिकारिक सरकारी स्टॉक लेजर (स्वचालित)',
        shopLedgerNotice: 'नोट: यह स्टॉक गोदाम से प्राप्त चालान द्वारा स्वचालित रूप से गिना जाता है। दुकानदार इसमें मनमाना बदलाव नहीं कर सकता।',
        fciDispatched: 'सरकारी गोदाम से प्राप्त',
        distributedToday: 'अब तक वितरित',
        balanceInShop: 'दुकान में शेष स्टॉक',
        reportStockDamage: 'क्षतिग्रस्त स्टॉक निरीक्षण दर्ज करें ⚠️',
        
        adminTitle: 'राज्य खाद्य एवं नागरिक आपूर्ति कमान केंद्र',
        adminSubtitle: 'लाइव टेलीमेट्री, AI फ्रॉड डिटेक्शन और जन शिकायत निवारण',
        statTotalFps: 'कुल सक्रिय दुकानें',
        statBeneficiaries: 'पंजीकृत परिवार',
        statDistributedMT: 'वितरित अनाज (मीट्रिक टन)',
        statActiveGrievances: 'सक्रिय नागरिक शिकायतें',
        aiFraudDetection: '🤖 AI धोखाधड़ी एवं अनियमितता रडार',
        grievanceDesk: 'नागरिक SOS आपातकालीन निवारण डेस्क',
        resolveBtn: 'मामला सुलझाएं',

        // Direct Citizen-to-Gov Query
        queryDeskTitle: '💬 सीधा सरकारी सहायता एवं समाधान केंद्र',
        queryDeskSub: 'अपने राशन कार्ड, कोटा या योजना के बारे में सीधे खाद्य विभाग से प्रश्न पूछें।',
        queryCategory: 'पूछताछ की श्रेणी चुनें',
        queryCategoryMember: '🏷️ राशन कार्ड में नाम / सदस्य बदलाव पूछताछ',
        queryCategoryQuota: '⚖️ अनाज कोटा एवं रियायती दर जानकारी',
        queryCategoryShop: '📍 राशन दुकान स्थानांतरण अनुरोध',
        queryCategoryScheme: '📜 अंत्योदय / प्राथमिकता परिवार पात्रता',
        queryCategoryGeneral: '❓ सामान्य सरकारी सहायता एवं पूछताछ',
        querySubject: 'विषय (संक्षेप में)',
        queryMessage: 'अपना प्रश्न / समस्या विस्तार से लिखें',
        submitQueryBtn: 'सरकार को प्रश्न भेजें 🚀',
        myQueriesTitle: '📋 मेरे पूछे गए प्रश्न एवं सरकारी उत्तर',
        adminQueryTitle: '📬 सीधा नागरिक प्रश्न एवं सहायता डेस्क',
        adminQuerySubtitle: 'नागरिकों द्वारा पूछे गए सभी प्रश्नों की लाइव सूची एवं आधिकारिक समाधान',
        replyBtn: 'आधिकारिक उत्तर भेजें ✍️'
    },
    en: {
        appTitle: 'AnnaMitra',
        appSubtitle: 'Smart Public Distribution System (Govt of Maharashtra)',
        portalCitizen: 'Citizen Portal',
        portalShopkeeper: 'Shopkeeper Portal',
        portalAdmin: 'Govt Command Center',
        roleCitizen: 'Citizen / Family',
        roleShopkeeper: 'Fair Price Shop Dealer',
        roleAdmin: 'Civil Supplies Officer',
        audioAssistant: 'Voice Guide',
        audioOn: 'Voice On',
        audioOff: 'Voice Off',
        switchLanguage: 'Language',
        logout: 'Logout 🚪',
        backToHome: '← Back to Homepage',

        heroTag: 'Government of Maharashtra • Public Distribution System',
        heroTitle: 'SMART PUBLIC DISTRIBUTION SYSTEM',
        heroSubtitle: 'A smarter, faster, and transparent way to distribute ration to every eligible family in Maharashtra.',
        exploreServicesBtn: '🚀 Explore Services',
        whoAreYouTitle: 'Choose Your Portal',
        whoAreYouSubtitle: 'Please select who you are to proceed to your dedicated portal:',
        roleCardCitizenTitle: 'Citizen / Beneficiary',
        roleCardCitizenDesc: 'Check your ration quota, book 3-slot queue-free tokens, and view past claim passbook.',
        roleCardShopkeeperTitle: 'Fair Price Shop Dealer',
        roleCardShopkeeperDesc: 'Dispense grains via OTP, view immutable stock ledger, and register new family members.',
        roleCardAdminTitle: 'Government Command Center',
        roleCardAdminDesc: 'Live statewide supply telemetry, AI fraud anomaly detection, and SOS redressal.',

        loginCitizenHeading: 'Login to ANNAMITRA',
        loginCitizenSub: 'See your ration, family & shop details',
        loginShopkeeperHeading: 'Shopkeeper Terminal Login',
        loginShopkeeperSub: 'Access your Fair Price Shop counter system',
        loginAdminHeading: 'Civil Supplies Command Login',
        loginAdminSub: 'Access Statewide Telemetry & Grievance Desk',
        inputRationCardNo: 'Ration Card Number',
        inputPassword: 'Password / 4-Digit PIN',
        inputFpsId: 'Fair Price Shop ID',
        inputOfficerId: 'Officer ID',
        loginBtn: '✅ Login',
        noAccountNotice: 'Don\'t have an account? Visit your local Fair Price Shop.',

        available: 'Available',
        booked: 'Token Booked',
        collected: 'Ration Collected',
        confirmed: 'Confirmed',
        pending: 'Pending',
        critical: 'Critical',
        kg: 'kg',
        litre: 'L',
        rupees: '₹',
        free: 'Free (₹0)',
        close: 'Close',
        cancel: 'Cancel',
        confirm: 'Confirm',
        downloadReceipt: 'Download Receipt',
        printReceipt: 'Print Receipt',
        helpLine: 'Toll-Free Helpline: 1800-22-4950',

        citizenWelcome: 'Welcome,',
        rationCardNo: 'Ration Card No.:',
        cardType: 'Card Category:',
        assignedFps: 'Assigned Fair Price Shop:',
        viewShopStock: 'Check Shop Stock',
        
        myMonthlyQuota: 'Your Entitled Quota for August 2026',
        quotaSubtitle: 'All items listed below are legally allocated for your family. Do not pay anything extra!',
        rice: 'Rice',
        wheat: 'Wheat',
        sugar: 'Sugar',
        oil: 'Cooking Oil',
        totalPayable: 'Total Payable Amount:',
        
        bookSlotTitle: 'Book Your Ration Collection Time (Token)',
        bookSlotDesc: 'Never wait in long queues again! Choose one of the 3 slots below and tap the green button.',
        slot1Title: 'Morning Slot (10:00 AM - 12:00 PM)',
        slot2Title: 'Mid-Day Slot (12:00 PM - 02:00 PM)',
        slot3Title: 'Evening Slot (04:00 PM - 08:00 PM)',
        spotsRemaining: 'spots left',
        bookNowBtn: 'Book This Token 🎫',
        alreadyBooked: 'Your Token Is Active',
        
        activeTokenTitle: 'Your Digital Ration Token Pass',
        tokenNo: 'Token Number',
        assignedTime: 'Time Slot',
        validDate: 'Date',
        secureOtp: 'Secure Verification OTP',
        otpInstruction: 'Share this 4-digit code ONLY at the counter when receiving your grains.',
        currentServing: 'Currently Serving Token:',
        yourTurnIn: 'Estimated wait time:',
        cancelTokenBtn: 'Cancel Token ❌',
        
        sosTitle: 'Did the dealer refuse your ration?',
        sosDesc: 'If the shopkeeper claims "out of stock" or demands extra money, immediately press this red SOS button!',
        sosBtn: '🚨 Ration Denied? File Immediate SOS',
        sosModalTitle: 'Emergency Grievance (Direct Food Inspector Alert)',
        sosReason1: 'Dealer falsely claimed stock is finished',
        sosReason2: 'Demanded money above official government rate',
        sosReason3: 'Underweighed grains / provided spoiled quality',
        sosReason4: 'Shop closed during official business hours',
        sosSubmitBtn: 'Dispatch Inspection Squad',
        
        familyTitle: 'Linked Family Members',
        aadhaarLinked: 'Aadhaar Verified ✅',
        aadhaarPending: 'Aadhaar Link Pending ⚠️',

        passbookTitle: 'Digital Ration Passbook (Past Claims)',
        passbookDesc: 'Complete tamper-proof record of grains received in previous months.',
        receiptNo: 'Receipt #:',
        dateOfClaim: 'Date & Time:',
        collectedItems: 'Grains Received:',
        verifiedBy: 'Verification Method:',
        
        fpsPortalTitle: 'Fair Price Shop Terminal',
        fpsSubtitle: 'Digital Identity Verification, Dual-Ledger Stock & Member Registration',
        scannerTitle: 'Citizen Token & OTP Verification',
        enterCardOrToken: 'Enter Citizen Ration Card No. or Token No.',
        searchBeneficiary: 'Search 🔍',
        beneficiaryDetails: 'Beneficiary Verification Summary',
        deliverGrainBtn: 'Dispense Ration & Issue Digital Receipt ✅',
        enterOtpToConfirm: 'Enter Citizen 4-Digit Security OTP',
        
        addNewMemberTitle: 'Add New Family Member (Update Ration Card)',
        addNewMemberDesc: 'Add newly born infants or newly married family members:',
        inputMemberName: 'Full Name of Member',
        inputMemberRelation: 'Relationship',
        inputMemberAge: 'Age (Years)',
        inputMemberGender: 'Gender',
        inputMemberAadhaar: '12-Digit Aadhaar Number',
        saveNewMemberBtn: 'Add Member & Recalculate Quota ➕',

        shopLedgerTitle: 'Official Immutable Inventory Ledger',
        shopLedgerNotice: 'Note: Stock is automatically calculated from Central FCI Godown Dispatches. Dealers cannot manually alter quantities.',
        fciDispatched: 'Received from Warehouse',
        distributedToday: 'Distributed to Citizens',
        balanceInShop: 'Live Available in Shop',
        reportStockDamage: 'File Stock Damage Inspection Request ⚠️',
        
        adminTitle: 'State Food & Civil Supplies Command Center',
        adminSubtitle: 'Live Supply Chain Telemetry, AI Anomaly Guard & Emergency Redressal',
        statTotalFps: 'Active Fair Price Shops',
        statBeneficiaries: 'Registered Families',
        statDistributedMT: 'Grain Distributed (MT)',
        statActiveGrievances: 'Active Grievances',
        aiFraudDetection: '🤖 AI Fraud & Anomaly Detection Radar',
        grievanceDesk: 'Emergency Citizen SOS Redressal Desk',
        resolveBtn: 'Resolve & Close',

        // Direct Citizen-to-Gov Query
        queryDeskTitle: '💬 Direct Citizen-to-Government Query & Helpdesk',
        queryDeskSub: 'Ask questions regarding your ration card, grain quotas, or government welfare schemes directly to the Food Supplies Department.',
        queryCategory: 'Select Inquiry Category',
        queryCategoryMember: '🏷️ Ration Card Name / Member Update Inquiry',
        queryCategoryQuota: '⚖️ Quota & Subsidized Grain Pricing Clarification',
        queryCategoryShop: '📍 Fair Price Shop Relocation / Dealer Change Request',
        queryCategoryScheme: '📜 Antyodaya / Priority Household Scheme Eligibility',
        queryCategoryGeneral: '❓ General Government Support & Inquiry',
        querySubject: 'Subject (Brief)',
        queryMessage: 'Detailed Question / Problem Description',
        submitQueryBtn: 'Submit Query to Government 🚀',
        myQueriesTitle: '📋 My Submitted Queries & Official Responses',
        adminQueryTitle: '📬 Direct Citizen Query & Support Desk',
        adminQuerySubtitle: 'Live statewide feed of citizen inquiries with official officer resolution desk',
        replyBtn: 'Send Official Reply ✍️'
    }
};

class I18nEngine {
    constructor() {
        this.currentLang = window.annasetuStore ? window.annasetuStore.state.currentLanguage : 'mr';
    }

    t(key) {
        if (!i18n[this.currentLang] || !i18n[this.currentLang][key]) {
            return (i18n['en'] && i18n['en'][key]) || key;
        }
        return i18n[this.currentLang][key];
    }

    setLanguage(lang) {
        if (i18n[lang]) {
            this.currentLang = lang;
            if (window.annasetuStore && typeof window.annasetuStore.setLanguage === 'function') {
                try { window.annasetuStore.setLanguage(lang); } catch (e) {}
            }
            this.updateDOM();

            // Re-render active portals dynamically
            try {
                if (window.annasetuCitizen && typeof window.annasetuCitizen.renderAll === 'function') {
                    window.annasetuCitizen.renderAll();
                }
                if (window.annasetuShopkeeper && typeof window.annasetuShopkeeper.renderAll === 'function') {
                    window.annasetuShopkeeper.renderAll();
                }
                if (window.annasetuAdmin && typeof window.annasetuAdmin.renderAll === 'function') {
                    window.annasetuAdmin.renderAll();
                }
            } catch (err) {
                console.log('Language DOM re-render note:', err);
            }
        }
    }

    updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) {
                if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                    el.setAttribute('placeholder', translation);
                } else {
                    el.textContent = translation;
                }
            }
        });

        // Update active language button styles
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

window.annasetuI18n = new I18nEngine();
