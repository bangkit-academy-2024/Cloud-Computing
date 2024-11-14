let mediaFile = null;
let isTyping = false;

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

function checkInput() {
  const chatInput = document.getElementById('chat-input').value.trim();
  const sendBtn = document.getElementById('send-btn');
  sendBtn.disabled = chatInput.length === 0 && !mediaFile;

  if (chatInput.length > 0 && !isTyping) {
    showTypingIndicator();
  } else if (chatInput.length === 0 && isTyping) {
    hideTypingIndicator();
  }
}

async function sendMessage() {
  const chatBody = document.getElementById('chat-body');
  const chatInput = document.getElementById('chat-input');
  const messageText = chatInput.value.trim();
  const user = getCookie('username');

  if (!user) {
    console.error('User cookie is not set.');
    return;
  }

  if (messageText || mediaFile) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'sent');

    if (mediaFile) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const imgDataUrl = e.target.result;
        messageElement.innerHTML = `<div class="bubble"><img src="${imgDataUrl}" alt="Media"><br>${messageText}</div>`;
        chatBody.appendChild(messageElement);

        const form = new FormData();
        form.append('file', mediaFile, mediaFile.name);

        try {
          const uploadResponse = await fetch('https://tmpfiles.org/api/v1/upload', {
            method: 'POST',
            body: form,
          });
          const uploadData = await uploadResponse.json();
          console.log(uploadData);

          const match = /https?:\/\/tmpfiles.org\/(.*)/.exec(uploadData.data.url);
          const imageBuffer = `https://tmpfiles.org/dl/${match[1]}`;

          const response = await fetch('https://luminai.my.id/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: messageText || 'ada yang saya inginkan dari gambar image ini', user, imageBuffer }),
          });
          const data = await response.json();
          console.log('Response:', data);

          // Clear input and media preview immediately after sending
          clearInputAndMedia();

          // Simulate bot response
          setTimeout(() => {
            const botMessageElement = document.createElement('div');
            botMessageElement.classList.add('message', 'received');
            botMessageElement.innerHTML = `<div class="bubble">${data.result}</div>`;
            chatBody.appendChild(botMessageElement);
            chatBody.scrollTop = chatBody.scrollHeight;
          }, 1000);
        } catch (error) {
          console.error('Error:', error);
        }

        chatBody.scrollTop = chatBody.scrollHeight;
        hideTypingIndicator();
      };
      reader.readAsDataURL(mediaFile);
    } else {
      messageElement.innerHTML = `<div class="bubble">${messageText}</div>`;
      chatBody.appendChild(messageElement);

      try {
        const response = await fetch('https://luminai.my.id/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: messageText, user, webSearchMode: false }),
        });
        const data = await response.json();
        console.log('Response:', data);

        // Clear input immediately after sending
        clearInputAndMedia();

        // Simulate bot response
        setTimeout(() => {
          const botMessageElement = document.createElement('div');
          botMessageElement.classList.add('message', 'received');
          botMessageElement.innerHTML = `<div class="bubble">${data.result}</div>`;
          chatBody.appendChild(botMessageElement);
          chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000);
      } catch (error) {
        console.error('Error:', error);
      }

      chatBody.scrollTop = chatBody.scrollHeight;
      hideTypingIndicator();
    }
  }
  checkInput();
}

// New function to clear input and media
function clearInputAndMedia() {
  const chatInput = document.getElementById('chat-input');
  chatInput.value = '';
  mediaFile = null;
  document.getElementById('media-input').value = '';
  document.getElementById('preview-img').src = '';
  document.getElementById('media-preview').style.display = 'none';
}

function previewMedia() {
  const mediaInput = document.getElementById('media-input');
  mediaFile = mediaInput.files[0];
  const previewImg = document.getElementById('preview-img');
  const mediaPreview = document.getElementById('media-preview');

  if (mediaFile && mediaFile.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      mediaPreview.style.display = 'flex';
    };
    reader.readAsDataURL(mediaFile);
  }
  checkInput();
}

function cancelMedia() {
  mediaFile = null;
  document.getElementById('media-input').value = '';
  document.getElementById('preview-img').src = '';
  document.getElementById('media-preview').style.display = 'none';
  checkInput();
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function getRandomText() {
  return `user-${Math.floor(Math.random() * 100000)}`;
}

function setRandomTextCookie(randomText) {
  document.cookie = `username=${randomText}; path=/`;
}

window.onload = function () {
  if (!getCookie('username')) {
    setRandomTextCookie(getRandomText());
  }
};

function showTypingIndicator() {
  isTyping = true;
  const statusElement = document.getElementById('status');
  statusElement.textContent = 'Mengetik';
  statusElement.classList.add('typing');
}

function hideTypingIndicator() {
  isTyping = false;
  const statusElement = document.getElementById('status');
  statusElement.textContent = 'Online';
  statusElement.classList.remove('typing');
}
