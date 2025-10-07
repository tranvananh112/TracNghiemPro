// AI Quiz Generator Module - Hoàn toàn độc lập, không cần API
class AIQuizGenerator {
    constructor(quizManager) {
        this.quizManager = quizManager;
        this.initializeAIListeners();
    }

    initializeAIListeners() {
        // Paste AI content
        const pasteAIBtn = document.getElementById('paste-ai-content');
        if (pasteAIBtn) {
            pasteAIBtn.addEventListener('click', () => {
                this.quizManager.pasteFromClipboard('ai-content-input');
            });
        }

        // Generate AI quiz
        const generateBtn = document.getElementById('generate-ai-quiz');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateAIQuiz();
            });
        }

        // Clear AI input
        const clearAIBtn = document.getElementById('clear-ai-input');
        if (clearAIBtn) {
            clearAIBtn.addEventListener('click', () => {
                this.clearAIInputs();
            });
        }

        // Save AI quiz
        const saveAIBtn = document.getElementById('save-ai-quiz');
        if (saveAIBtn) {
            saveAIBtn.addEventListener('click', () => {
                this.saveAIQuiz();
            });
        }

        // Edit AI quiz
        const editAIBtn = document.getElementById('edit-ai-quiz');
        if (editAIBtn) {
            editAIBtn.addEventListener('click', () => {
                this.enableEditMode();
            });
        }

        // Cancel AI quiz
        const cancelAIBtn = document.getElementById('cancel-ai-quiz');
        if (cancelAIBtn) {
            cancelAIBtn.addEventListener('click', () => {
                this.cancelAIQuiz();
            });
        }
    }

    loadAISettings() {
        // No settings needed for standalone AI
    }

    clearAIInputs() {
        document.getElementById('ai-content-input').value = '';
        document.getElementById('ai-question-count').value = '10';
        this.quizManager.showToast('🗑️ Đã xóa nội dung', 'info');
    }

    async generateAIQuiz() {
        const content = document.getElementById('ai-content-input').value.trim();
        const questionCount = parseInt(document.getElementById('ai-question-count').value) || 10;

        // Validation
        if (!content) {
            this.quizManager.showToast('⚠️ Vui lòng nhập nội dung bài học!', 'error');
            return;
        }

        if (content.length < 100) {
            this.quizManager.showToast('⚠️ Nội dung quá ngắn! Vui lòng nhập ít nhất 100 ký tự.', 'error');
            return;
        }

        // Show loading
        document.getElementById('ai-loading').style.display = 'block';
        document.getElementById('ai-preview').style.display = 'none';

        try {
            // Simulate processing time for better UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            const questions = this.analyzeContentAndGenerateQuestions(content, questionCount);
            
            if (!questions || questions.length === 0) {
                throw new Error('Không thể tạo câu hỏi từ nội dung này. Vui lòng thử với nội dung khác.');
            }

            this.quizManager.aiGeneratedQuiz = {
                questions: questions,
                totalQuestions: questions.length
            };

            this.displayAIPreview(questions);
            this.quizManager.showToast(`✨ AI đã tạo ${questions.length} câu hỏi!`, 'success');

        } catch (error) {
            console.error('AI Error:', error);
            this.quizManager.showToast(`❌ Lỗi: ${error.message}`, 'error');
        } finally {
            document.getElementById('ai-loading').style.display = 'none';
        }
    }

    analyzeContentAndGenerateQuestions(content, maxQuestions) {
        // Phân tích nội dung và tạo câu hỏi
        const sentences = this.extractSentences(content);
        const keyPhrases = this.extractKeyPhrases(content);
        const questions = [];

        // Tạo câu hỏi từ các câu quan trọng
        for (let i = 0; i < sentences.length && questions.length < maxQuestions; i++) {
            const sentence = sentences[i];
            
            // Bỏ qua câu quá ngắn hoặc quá dài
            if (sentence.length < 20 || sentence.length > 200) continue;

            const question = this.generateQuestionFromSentence(sentence, keyPhrases, content);
            if (question) {
                questions.push(question);
            }
        }

        // Nếu không đủ câu hỏi, tạo thêm từ key phrases
        if (questions.length < maxQuestions) {
            const additionalQuestions = this.generateQuestionsFromKeyPhrases(keyPhrases, content, maxQuestions - questions.length);
            questions.push(...additionalQuestions);
        }

        return questions.slice(0, maxQuestions);
    }

    extractSentences(content) {
        // Tách câu dựa trên dấu câu
        const sentences = content
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        // Sắp xếp theo độ quan trọng (câu dài hơn thường chứa nhiều thông tin hơn)
        return sentences.sort((a, b) => {
            const scoreA = this.calculateSentenceImportance(a);
            const scoreB = this.calculateSentenceImportance(b);
            return scoreB - scoreA;
        });
    }

    calculateSentenceImportance(sentence) {
        let score = 0;
        
        // Câu có từ khóa quan trọng
        const importantWords = ['là', 'được', 'có', 'bao gồm', 'gồm', 'như', 'ví dụ', 'nghĩa là', 'tức là', 'chính là'];
        importantWords.forEach(word => {
            if (sentence.toLowerCase().includes(word)) score += 2;
        });

        // Câu có số liệu
        if (/\d+/.test(sentence)) score += 3;

        // Độ dài hợp lý
        if (sentence.length >= 30 && sentence.length <= 150) score += 5;

        // Có dấu phẩy (thường là câu phức, chứa nhiều thông tin)
        score += (sentence.match(/,/g) || []).length;

        return score;
    }

    extractKeyPhrases(content) {
        // Trích xuất các cụm từ quan trọng
        const words = content.toLowerCase().split(/\s+/);
        const phrases = [];
        const stopWords = ['là', 'của', 'và', 'có', 'được', 'trong', 'với', 'để', 'cho', 'từ', 'một', 'các', 'này', 'đó', 'những'];

        // Tìm các danh từ riêng và thuật ngữ (chữ hoa)
        const capitalizedWords = content.match(/[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+/g) || [];
        phrases.push(...capitalizedWords);

        // Tìm các cụm từ 2-3 từ có ý nghĩa
        for (let i = 0; i < words.length - 1; i++) {
            if (!stopWords.includes(words[i]) && !stopWords.includes(words[i + 1])) {
                phrases.push(words[i] + ' ' + words[i + 1]);
            }
        }

        // Loại bỏ trùng lặp và sắp xếp theo tần suất
        const phraseCount = {};
        phrases.forEach(phrase => {
            phraseCount[phrase] = (phraseCount[phrase] || 0) + 1;
        });

        return Object.keys(phraseCount)
            .sort((a, b) => phraseCount[b] - phraseCount[a])
            .slice(0, 20);
    }

    generateQuestionFromSentence(sentence, keyPhrases, fullContent) {
        // Tìm từ khóa chính trong câu
        const mainKeyword = this.findMainKeyword(sentence, keyPhrases);
        if (!mainKeyword) return null;

        // Tạo câu hỏi bằng cách thay thế từ khóa
        const questionTypes = [
            () => this.createWhatIsQuestion(sentence, mainKeyword),
            () => this.createDefinitionQuestion(sentence, mainKeyword),
            () => this.createWhichQuestion(sentence, mainKeyword),
            () => this.createHowManyQuestion(sentence, mainKeyword)
        ];

        // Chọn ngẫu nhiên một loại câu hỏi
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        return questionType();
    }

    findMainKeyword(sentence, keyPhrases) {
        // Tìm key phrase xuất hiện trong câu
        for (const phrase of keyPhrases) {
            if (sentence.toLowerCase().includes(phrase.toLowerCase())) {
                return phrase;
            }
        }
        return null;
    }

    createWhatIsQuestion(sentence, keyword) {
        // Tạo câu hỏi dạng "... là gì?"
        const cleanSentence = sentence.replace(/[.!?]+$/, '');
        
        // Tìm định nghĩa trong câu
        const match = cleanSentence.match(/(.+?)\s+(là|được định nghĩa là|nghĩa là)\s+(.+)/i);
        
        if (match) {
            const subject = match[1].trim();
            const definition = match[3].trim();
            
            return {
                question: `${subject} là gì?`,
                options: this.generateOptions(definition, 'definition'),
                correctAnswer: 'A'
            };
        }

        // Fallback: tạo câu hỏi chung
        return {
            question: `Theo nội dung, ${keyword} có đặc điểm gì?`,
            options: this.generateOptions(cleanSentence, 'general'),
            correctAnswer: 'A'
        };
    }

    createDefinitionQuestion(sentence, keyword) {
        const cleanSentence = sentence.replace(/[.!?]+$/, '');
        
        return {
            question: `Khái niệm nào sau đây đúng về ${keyword}?`,
            options: this.generateOptions(cleanSentence, 'definition'),
            correctAnswer: 'A'
        };
    }

    createWhichQuestion(sentence, keyword) {
        const cleanSentence = sentence.replace(/[.!?]+$/, '');
        
        return {
            question: `Điều nào sau đây đúng về ${keyword}?`,
            options: this.generateOptions(cleanSentence, 'statement'),
            correctAnswer: 'A'
        };
    }

    createHowManyQuestion(sentence, keyword) {
        // Tìm số trong câu
        const numbers = sentence.match(/\d+/g);
        
        if (numbers && numbers.length > 0) {
            const number = numbers[0];
            const cleanSentence = sentence.replace(/[.!?]+$/, '');
            
            return {
                question: `Có bao nhiêu ${keyword} được đề cập?`,
                options: this.generateNumericOptions(number),
                correctAnswer: 'A'
            };
        }

        return this.createWhatIsQuestion(sentence, keyword);
    }

    generateOptions(correctAnswer, type) {
        const options = [
            { letter: 'A', text: correctAnswer }
        ];

        // Tạo các đáp án sai hợp lý
        const wrongAnswers = this.generateWrongAnswers(correctAnswer, type);
        
        wrongAnswers.forEach((answer, index) => {
            options.push({
                letter: String.fromCharCode(66 + index), // B, C, D
                text: answer
            });
        });

        return options;
    }

    generateWrongAnswers(correctAnswer, type) {
        const wrongAnswers = [];
        
        // Tạo đáp án sai bằng cách thay đổi một phần của đáp án đúng
        const words = correctAnswer.split(' ');
        
        if (words.length > 3) {
            // Đảo ngược một phần
            const reversed = [...words];
            const mid = Math.floor(words.length / 2);
            [reversed[0], reversed[mid]] = [reversed[mid], reversed[0]];
            wrongAnswers.push(reversed.join(' '));

            // Thay đổi từ quan trọng
            const modified1 = [...words];
            modified1[Math.floor(words.length / 3)] = 'không';
            wrongAnswers.push(modified1.join(' '));

            // Thêm phủ định
            wrongAnswers.push('Không ' + correctAnswer.toLowerCase());
        } else {
            // Với câu ngắn, tạo đáp án đối lập
            wrongAnswers.push('Không phải ' + correctAnswer.toLowerCase());
            wrongAnswers.push('Ngược lại với ' + correctAnswer.toLowerCase());
            wrongAnswers.push('Khác với ' + correctAnswer.toLowerCase());
        }

        return wrongAnswers.slice(0, 3);
    }

    generateNumericOptions(correctNumber) {
        const num = parseInt(correctNumber);
        const options = [
            { letter: 'A', text: correctNumber }
        ];

        // Tạo các số gần đúng
        const wrongNumbers = [
            num - 1,
            num + 1,
            num * 2
        ].filter(n => n > 0);

        wrongNumbers.forEach((n, index) => {
            options.push({
                letter: String.fromCharCode(66 + index),
                text: n.toString()
            });
        });

        return options;
    }

    generateQuestionsFromKeyPhrases(keyPhrases, content, count) {
        const questions = [];
        
        for (let i = 0; i < keyPhrases.length && questions.length < count; i++) {
            const phrase = keyPhrases[i];
            
            // Tìm câu chứa key phrase
            const sentences = content.split(/[.!?]+/);
            const relevantSentence = sentences.find(s => 
                s.toLowerCase().includes(phrase.toLowerCase()) && s.length > 20
            );

            if (relevantSentence) {
                const question = {
                    question: `Theo nội dung, ${phrase} có đặc điểm gì?`,
                    options: this.generateOptions(relevantSentence.trim(), 'general'),
                    correctAnswer: 'A'
                };
                questions.push(question);
            }
        }

        return questions;
    }

    displayAIPreview(questions) {
        const previewContent = document.getElementById('ai-quiz-preview-content');
        const questionTotal = document.getElementById('ai-question-total');
        
        questionTotal.textContent = questions.length;

        const questionsHTML = questions.map((q, index) => `
            <div class="preview-question" data-index="${index}">
                <div class="preview-question-header">
                    <div class="preview-question-number">${index + 1}</div>
                    <div class="preview-question-text" contenteditable="false">${q.question}</div>
                </div>
                <div class="preview-options">
                    ${q.options.map(opt => `
                        <div class="preview-option ${opt.letter === q.correctAnswer ? 'correct' : ''}" data-letter="${opt.letter}">
                            <span class="preview-option-letter">${opt.letter}.</span>
                            <span class="preview-option-text" contenteditable="false">${opt.text}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="preview-correct-answer">
                    <i class="fas fa-check-circle"></i>
                    Đáp án đúng: ${q.correctAnswer}
                </div>
            </div>
        `).join('');

        previewContent.innerHTML = questionsHTML;
        
        document.getElementById('ai-preview').style.display = 'block';
        document.getElementById('ai-preview').scrollIntoView({ behavior: 'smooth' });
    }

    enableEditMode() {
        const questions = document.querySelectorAll('.preview-question');
        questions.forEach(q => {
            q.classList.add('editable');
            const questionText = q.querySelector('.preview-question-text');
            const optionTexts = q.querySelectorAll('.preview-option-text');
            
            questionText.contentEditable = 'true';
            optionTexts.forEach(opt => {
                opt.contentEditable = 'true';
            });

            // Add click handler for correct answer selection
            const options = q.querySelectorAll('.preview-option');
            options.forEach(opt => {
                opt.style.cursor = 'pointer';
                opt.addEventListener('click', () => {
                    options.forEach(o => o.classList.remove('correct'));
                    opt.classList.add('correct');
                    
                    const letter = opt.dataset.letter;
                    const correctAnswerDiv = q.querySelector('.preview-correct-answer');
                    correctAnswerDiv.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        Đáp án đúng: ${letter}
                    `;
                });
            });
        });

        this.quizManager.showToast('✏️ Chế độ chỉnh sửa đã bật. Click vào đáp án để chọn đáp án đúng.', 'info');
    }

    saveAIQuiz() {
        const quizName = document.getElementById('ai-quiz-name').value.trim();
        
        if (!quizName) {
            this.quizManager.showToast('⚠️ Vui lòng nhập tên cho quiz!', 'error');
            return;
        }

        // Collect edited questions
        const questions = [];
        const questionElements = document.querySelectorAll('.preview-question');
        
        questionElements.forEach((qEl, index) => {
            const questionText = qEl.querySelector('.preview-question-text').textContent.trim();
            const options = [];
            let correctAnswer = '';

            qEl.querySelectorAll('.preview-option').forEach(optEl => {
                const letter = optEl.dataset.letter;
                const text = optEl.querySelector('.preview-option-text').textContent.trim();
                
                options.push({ letter, text });
                
                if (optEl.classList.contains('correct')) {
                    correctAnswer = letter;
                }
            });

            questions.push({
                question: questionText,
                options: options,
                correctAnswer: correctAnswer
            });
        });

        // Create quiz object
        const quiz = {
            id: Date.now().toString(),
            title: quizName,
            description: 'Quiz được tạo bởi AI tự động',
            questions: questions,
            createdAt: new Date().toISOString(),
            totalQuestions: questions.length
        };

        // Save to quizzes
        this.quizManager.quizzes.push(quiz);
        this.quizManager.saveQuizzes();
        this.quizManager.loadQuizList();
        this.quizManager.updateQuizSelector();

        // Clear and switch tab
        this.cancelAIQuiz();
        this.quizManager.switchTab('manage');
        
        this.quizManager.showToast(`🎉 Đã lưu quiz "${quizName}" với ${questions.length} câu hỏi!`, 'success');
    }

    cancelAIQuiz() {
        document.getElementById('ai-preview').style.display = 'none';
        document.getElementById('ai-quiz-name').value = '';
        this.quizManager.aiGeneratedQuiz = null;
    }
}

// Initialize AI Generator when QuizManager is ready
if (typeof QuizManager !== 'undefined') {
    QuizManager.prototype.loadAISettings = function() {
        if (!this.aiGenerator) {
            this.aiGenerator = new AIQuizGenerator(this);
            this.aiGenerator.loadAISettings();
        }
    };
}
