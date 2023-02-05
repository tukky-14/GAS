// デプロイ > ウェブアプリ > アクセスできるユーザを「全員」にしてデプロイ

// 1. text（翻訳したいテキスト）
// 例：Hello
// 2. source（翻訳前の言語）
// 例：en
// 3. target（翻訳語の言語）
// 例：ja

function doGet(e) {
    // リクエストパラメータを取得する
    const p = e.parameter;
    //  LanguageAppクラスを用いて翻訳を実行
    const translatedText = LanguageApp.translate(p.text, p.source, p.target);
    // レスポンスボディの作成
    let body;
    if (translatedText) {
        body = {
            code: 200,
            text: translatedText,
        };
    } else {
        body = {
            code: 400,
            text: 'Bad Request',
        };
    }
    // レスポンスの作成
    const response = ContentService.createTextOutput();
    // Mime TypeをJSONに設定
    response.setMimeType(ContentService.MimeType.JSON);
    // JSONテキストをセットする
    response.setContent(JSON.stringify(body));

    console.log(JSON.stringify(body));

    return response;
}
