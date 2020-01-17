'use script';

/*
気づいたことをメモしていく
nodeListを配列に変換する処理を関数でまとめられないかな？
今扱っているデータ型が文字列なのか数値なのかしっかり確認していこう。
連続で演算子を使う場合の処理をどうすればいいのかな。
計算し結果をnumTextに文字列として結合させまた同じように関数をで処理できる形にする必要がある。
差し替える文字列を取得する際にどこからどこまでの文字列を取得するのかが大事だな。
=ボタンが押された処理としてまず加算除算のみか加算減算と乗算除算どっちも使うかで場合分けした方が良い気がする。
引き継がせたい値はtargetのtextContent
小数点に対応するのが難しいな。
*/

{
  const calculateResult=document.getElementById('calculateResult');
  const numberBtn=document.querySelectorAll('.numbersBoard .numberBtn p');
  const calculationsBtn=document.querySelectorAll('.calculationsBoard .calculationsBtn p');
  //注意しなければならないのはnumberBtnは配列ではなくnodeListなのでmapなどは使えないこと！
  
  const numberBtnArray=Array.from(numberBtn);
  //これでnodeListをnumberBtnArrayという配列に変換して操作しやすい状態にした！
  let numText='';
  numberBtnArray.map(function(numberBtn) {
    numberBtn.addEventListener('click',()=>{
      numText+=numberBtn.textContent;
      calculateResult.textContent=numText;
    });
  });
  //数字ボタンが押されたらそれを数値として表示する。numTextは文字列ということに注意
  
  const reg=/\d/;
  
  const calculationsBtnArray=Array.from(calculationsBtn);
  //ここも同じようにnodeListをcalculationsBtnArrayの配列に変換して操作しやすい状態にした！
  calculationsBtnArray.map(function(calculationsBtn) {
    calculationsBtn.addEventListener('click',()=>{
      
      if(calculationsBtn.textContent==='＝') {
        var target=calculateResult.textContent;
        //targetには文字列が入るから注意。
        var calculation=closure(target);
        //targetを記憶した匿名関数をcalculationにセットする。
        if(target.includes('×')||target.includes('÷')) {
          var lengthOfTarget=target.length;
          var orderOfOperator=[];
          for (let i=0;i<lengthOfTarget;i++) {
            if(target.charAt(i)==='×'||target.charAt(i)==='÷') {
              orderOfOperator.push(target.charAt(i));
            }
          }
          //演算子を順番に配列に格納する。
          for (let i=0;i<lengthOfTarget;i++) {
            if(target.charAt(i)==='＋'&&reg.test(target.charAt(i-1))) {
              orderOfOperator.push(target.charAt(i));
            }
            if(target.charAt(i)==='ー'&&reg.test(target.charAt(i-1))) {
              orderOfOperator.push(target.charAt(i));
            }
          }
          //演算子を順番に配列に格納する。
          console.log(orderOfOperator);
          orderOfOperator.map((operator)=>{
            console.log(calculation(operator));
          });
        }else {
          var lengthOfTarget=target.length;
          var orderOfOperator=[];
          //式の中の演算子を順番に格納するため。
          for (let i=0;i<lengthOfTarget;i++) {
            if(target.charAt(i)==='＋'&&reg.test(target.charAt(i-1))) {
              orderOfOperator.push(target.charAt(i));
            }
            if(target.charAt(i)==='ー'&&reg.test(target.charAt(i-1))) {
              orderOfOperator.push(target.charAt(i));
            }
          }
          //演算子が左右数字に囲まれているならば演算子として配列に入れる。
          //演算子を順番に配列に格納する。
          console.log(orderOfOperator);
          orderOfOperator.map((operator)=>{
            console.log(calculation(operator));
          });
          //演算子の数だけローカル変数を引き継ぐクロージャを呼び出している。
          //ここでnumTextに計算結果を出力し、targetを更新している。
        }
        //ここでは入力された数式を場合分けしている。まず乗算か除算込み数式であるかないかで場合分け。
        
        calculateResult.textContent=numText;
        //計算した最終結果をcalculateResultに出力させる。
      }
      //＝が押された時の処理
      
      if(calculationsBtn.textContent!=='＝') {
        numText+=calculationsBtn.textContent;
        calculateResult.textContent=numText;
      }
      //演算子を表示する
      
      if(calculationsBtn.textContent==='C') {
        reset();
      }
      //cボタンが押されたら表示をリセットする
      
    });
  });
  
  function closure(init) {
    var target=init;
    return function(operator) {
      let indexOfOperator=target.indexOf(operator);
      let [prevNum,nextNum,targetOfReplace]=catchTarget(target,indexOfOperator);
      if(operator==='＋') {
        numText=prevNum+nextNum;
      }
      if(operator==='ー') {
        numText=prevNum-nextNum;
      }
      if(operator==='×') {
        numText=prevNum*nextNum;
      }
      if(operator==='÷') {
        numText=prevNum/nextNum;
      }
      let numStr=numText.toString();
      target=target.replace(targetOfReplace,numStr);
      return target;
    }
  }
  //クロージャの設計図。これを作ることで関数間でローカル変数が有効になる。
  
  const regex =/\d|\./;
  //演算する文字列を取得する際に使われる正規表現で0~9または小数点。.はエスケープしないと小数点を意味しないから注意！
  
  function reset() {
    calculateResult.textContent='計算結果を表示';
    numText='';
  }
  
  function catchTarget(target,indexOfOperator) {
    var countPrev=0;
    var countNext=0;
    var indexOfOperatorForPrev=indexOfOperator;
    var indexOfOperatorForNext=indexOfOperator;
    while(regex.test(target.substring(indexOfOperatorForPrev-1,indexOfOperatorForPrev))) {
      countPrev++;
      indexOfOperatorForPrev--;
    }
    //演算子の左の数が何個あるか取得している。
    while(regex.test(target.substring(indexOfOperatorForNext+1,indexOfOperatorForNext+2))) {
      countNext++;
      indexOfOperatorForNext++;
    }
    //演算子の右の数が何個あるか取得している。
    var targetOfReplace=target.substring(indexOfOperator-countPrev,indexOfOperator+countNext+1);
    //新たなtargetを生成する際にどこの文字列を差し替えるのかをここで取得している。
    var prevNum=0;
    var nextNum=0;
    if(target.substring(indexOfOperator-countPrev,indexOfOperator).includes('.')) {
      var strDecimal=target.substring(indexOfOperator-countPrev,indexOfOperator);
      var indexOfDecimal=parseInt(strDecimal.length)-1-strDecimal.indexOf('.');
      var strRemoveDecimal=strDecimal.replace('.','');
      prevNum=parseInt(strRemoveDecimal)/(10**indexOfDecimal);
      nextNum=parseInt(target.substring(indexOfOperator+1,indexOfOperator+countNext+1));
      //左の数字が小数点の場合の処理
    }else if(target.substring(indexOfOperator+1,indexOfOperator+countNext+1).includes('.')) {
      var strDecimal=target.substring(indexOfOperator+1,indexOfOperator+countNext+1);
      var indexOfDecimal=parseInt(strDecimal.length)-1-strDecimal.indexOf('.');
      var strRemoveDecimal=strDecimal.replace('.','');
      prevNum=parseInt(target.substring(indexOfOperator-countPrev,indexOfOperator));
      nextNum=parseInt(strRemoveDecimal)/(10**indexOfDecimal);
      //右の数字が小数点の場合の処理
    }else {
      prevNum=parseInt(target.substring(indexOfOperator-countPrev,indexOfOperator));
      nextNum=parseInt(target.substring(indexOfOperator+1,indexOfOperator+countNext+1));
    }
    //計算する数値をprevNum、nextNumのそれぞれ格納している。
    return [prevNum,nextNum,targetOfReplace];
    //複数の値を配列で返している。
  }
  //この関数は要するに演算子を基準としてどこまで計算するのかを取得する関数。
}

