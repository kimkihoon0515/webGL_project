# 2021년 1학기 컴퓨터 그래픽스 WebGL Tutorial Page
## Cube에 원하는 이미지 Texture 입히고 마우스 event 추가하기
이 페이지는 큐브에 Texture를 입히고 그 크기를 조절해보고 마우스를 통해서 원하는 면을 관찰해 보는 튜토리얼 페이지이다.

## 이름
소프트웨어학과 201620949 김기훈

## 주의사항
Texture를 입히는 과정에서 이미지 파일을 로컬에서 크롬브라우저가 보안상의 이유로 불러올 수 없기 때문에 Web Server For Chrome을 사용한다.  
![image](https://user-images.githubusercontent.com/63439911/152922971-5f1c98c8-c7aa-4579-ab14-7209bced7367.png)  




## Texture Mapping 을 하는 이유
![image](https://user-images.githubusercontent.com/63439911/152922733-3e46d1d8-4bcd-45a8-97af-698d043bafe9.png)  
사실적인 그림을 낮은 비용으로 만들 수 있기 때문 

## Texture Mapping 을 하기 위해서 해야하는 것
### 1. 가장 먼저 텍스쳐를 불러와야한다.    
![image](https://user-images.githubusercontent.com/63439911/152923051-e7cc8e59-633e-43f1-886c-003c606ddc5c.png)  
이번 프로젝트에서는 하나의 이미지 텍스쳐를 모든 면에 Mapping 해보겠습니다.   
### 2. 크기가 2의 거듭제곱인지 확인한다.    
![image](https://user-images.githubusercontent.com/63439911/152923076-6c0f662d-1b2a-49af-a431-54773167c1fa.png)  
![image](https://user-images.githubusercontent.com/63439911/152923092-f7107361-9e3b-488a-9042-3565aef669e8.png)  
일반적으로 너비와 높이가 2의 거듭제곱인 텍스쳐를 사용하는 것이 가장 이상적입니다. 왜냐하면 2의 거듭제곱인 텍스쳐는 비디오 메모리에 효율적으로 저장될 수 있고, 어떤 방식으로 사용되어야만 한다는 제약이 없기 때문입니다.  
예술가들이 이미 작성한 텍스쳐는 너비와 높이가 2의 거듭제곱이 되도록 크기를 맞춰줘야 하며, 가능하다면 아예 만들때부터 2의 거듭제곱으로 만드는 것이 좋습니다.  
너비와 높이는 2의 거듭제곱인 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 또는 2048 픽셀이어야 합니다.  
전부는 아니지만 많은 디바이스가 4096 픽셀도 지원하고 있으며, 어떤 디바이스는 8192 픽셀 이상을 지원하기도 합니다.      
### 3. 면에 텍스쳐 입히기  
![image](https://user-images.githubusercontent.com/63439911/152923122-fcb29e46-94be-4ce7-94b9-d8542588bbf9.png)  
텍스쳐를 사용하기 전에 텍스쳐의 좌표와 정육면체의 면의 정점을 매핑 시켜줘야 합니다.    
### 4. fragment shader 수정  
![image](https://user-images.githubusercontent.com/63439911/152923134-06c970a8-a810-492f-9c9d-08dab26157e9.png)  
이렇게 하면 프래그먼트의 색상을 정하기 위해 직접 프래그먼트에 색상값을 할당하지 않고, 샘플러(sampler)가 판단하기에 프래그먼트의 위치에 가장 잘 맞아 떨어진다고 여겨지는 텍셀(texel, 텍스쳐 내부에 있는 픽셀)값에 따라서 프래그먼트의 색상값을 계산해냅니다.  
### 5. vertex shader 수정  
![image](https://user-images.githubusercontent.com/63439911/152923196-bc98f4e7-022d-4f02-b4b9-6aad362c1a19.png)  
정점 색상 정보를 읽어오는 대신에 텍스쳐 좌표값을 읽어와서 설정한다는 점이 키 포인트 입니다.  
위와 같이 정점과 텍스쳐 좌표값을 매핑하면, 각 정점이 텍스쳐의 어느 지점에 해당 하는지 알려줄 수 있습니다.     
### 6. 사진 변경사항을 적용하는 코드 추가  
![image](https://user-images.githubusercontent.com/63439911/152923207-3f46b370-3ac9-474e-be60-2a2eee9fc6e5.png)  
File API는 사용자에 의해 선택된 파일을 나타내는 객체인 File을 포함하는 FileList에 접근할 수 있게 해줍니다.  
사용자가 하나의 파일만을 선택한 경우, 리스트의 첫 번째 파일만 고려하면 됩니다.  
그 후 불러온 이미지 너비와 높이가 2의 거듭제곱인지 확인하는 과정을 거친다.  
## 구현 화면
![image](https://user-images.githubusercontent.com/63439911/152923225-0bd33ec5-825d-490d-8339-2a2b2cfebaec.png)  
원하는 사진을 data 폴더 내에서 골라준다. 기본 이미지는 고양이 이미지이다.  
![image](https://user-images.githubusercontent.com/63439911/152923244-e2cfba18-b78d-4808-92ab-245bde4a2046.png)  
아주대 로고를 선택하고 변경을 누르면 다음과 같이 내가 선택한 사진으로 큐브의 이미지가 변경이 된다.

## Mouse Control event
### 큐브를 마우스 드래그와 휠 조절로 크기를 조절하고 보이는 면을 조절하는 기능이다.  

### 1. Mouse Click event  
이벤트 핸들러는 하나의 개체 (이벤트 개체)를 매개 변수로받는 함수입니다.  
다양한 유형의 이벤트는 다양한 유형의 이벤트 객체를 생성합니다.  
.target : The DOM element that initiated the event.  
.pageX : The mouse position relative to the left edge of the document.  
.pageY : The mouse position relative to the top edge of the document.  
.clientX : The mouse position relative to the left edge of the element.  
.clientY : The mouse position relative to the top edge of the element.  
.which : The specific key or button that was pressed.  
마우스 클릭을 해서 드래그한 방향으로 큐브가 돌아가게끔 추가해주는 코드이다.   
마우스의 이전 위치에서 오프셋을 계산하고 해당 오프셋을 사용하여 장면의 회전 각도를 수정합니다.  
단일 이벤트 핸들러에서 이벤트를 처리하려면 이벤트 객체에 대해 preventDefault ()를 호출하여 해당 이벤트가 상위 요소로 전달되지 않도록해야합니다.        
![image](https://user-images.githubusercontent.com/63439911/152923256-d04d51c7-79ee-4624-8ff6-a34b872126c4.png)  
### 2. Mouse Wheel event  
마우스 클릭과 마찬가지의 방법으로 이번에는 마우스 가운데에 있는 wheel을 이용해서 큐브를 확대 또는 축소하는 기능을 갖게끔 해주는 코드이다.    
![image](https://user-images.githubusercontent.com/63439911/152923268-c28a45af-924b-405f-a6bc-57129680b255.png)  
### 3. Add EventListener
앞에서 구현한 Mouse event 관련 기능들을 전부 canvas 내에서 EventListener로 호출해준다.  
mouseout : 마우스가 element를 벗어났을 때  
mousemove : 마우스가 element에서 움직일 때
mousedown : 마우스를 누르는 순간  
mouse up : down과 반대로 마우스를 누르고 있다가 손가락을 떼는 그 순간  
wheel : 마우스 wheel을 누르는 순간  
![image](https://user-images.githubusercontent.com/63439911/152923283-2e6eba92-6bbe-43cb-bd11-bd0f2a80cd8b.png)  

## 구현 화면
![image](https://user-images.githubusercontent.com/63439911/152923296-be5658c5-81ed-4426-9b51-31509259c935.png)  


## Review
간단해보였던 이미지 mapping이 이렇게나 까다로운 과정일줄 정말 몰랐었다. 이미지 좌표와 큐브좌표를 딱 맞춰서 대입해야해서 까다로웠고 초기에 기획했었던 큐브로 주사위를 만들기는 아쉽지만 개별적으로 진행해보기로 하였다. 특히 이미지를 불러오는데 사이즈가 달라서 이미지가 적용이 안되던 문제도 많았던 것 같다. 개인적으로 정말 흥미롭게 들었던 수업이니만큼 꼭 개별적으로 시간을 내서 이번 프로젝트에선 하지못했지만 초기에 계획했던 것들을 한번 해보면서 공부해보려 한다. 

## 참조 및 출처
https://developer.mozilla.org/ko/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
http://learnwebgl.brown37.net/browser_environment/events.html
https://git.ajou.ac.kr/hwan/webgl-tutorial/-/tree/master/student2020/better_project/201420989
https://git.ajou.ac.kr/hwan/webgl-tutorial/-/tree/master/student2020/better_project/201720579  
Based on Project https://github.com/hwan-ajou/webgl-1.0/tree/main/T08_culling 









