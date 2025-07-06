from collections import defaultdict
import random

def generate_questions(text, num_questions=5):
    # Simple rule-based question generator
    sentences = [s.strip() for s in text.split('.') if len(s) > 20]
    questions = []
    
    for sentence in sentences[:num_questions]:
        words = sentence.split()
        if len(words) > 5:
            # Create fill-in-the-blank question
            blank_pos = random.randint(2, len(words)-2)
            answer = words[blank_pos]
            words[blank_pos] = "_____"
            question = " ".join(words) + "?"
            
            questions.append({
                "question": question,
                "answer": answer.strip(',.')
            })
    
    return questions or [{"question": "What is the main topic?", "answer": "Sample answer"}]