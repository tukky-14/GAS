function getYahooNews() {
    const response = UrlFetchApp.fetch('https://news.yahoo.co.jp/');
    const text = response.getContentText('utf-8');

    //トップニュースのブロックを抽出
    const topic_block = Parser.data(text).from('class="sc-dENsGg duAoUg"').to('</div>').build();

    //ulタグで囲まれている記述（トップニュース）を抽出
    const content_block = Parser.data(topic_block).from('<ul>').to('</ul>').build();

    const newsList = [];
    // content_blockの要素のうち、aタグに囲まれている記述を抽出
    const topics = Parser.data(content_block).from('<a').to('</a>').iterate();

    // aタグに囲まれた記述の回数分、順位／タイトル／URLを抽出する
    for (news of topics) {
        //配列内のインデックス番号+1を取得（ニュース掲載順位として利用）
        const newsRank = topics.indexOf(news) + 1;

        //URL取得
        const newsUrl = news.replace(/.*href="/, '').replace(/".*/, '');
        //タイトル取得
        const newsTitle = news.replace(/.*class="sc-btzYZH kitJFB">/, '').replace(/<.*>/, '');

        // 各ニュースページからカテゴリを取得
        const newsResponse = UrlFetchApp.fetch(newsUrl);
        const newsText = newsResponse.getContentText('utf-8');
        const newsCategory = Parser.data(newsText).from('トピックス（').to('）').build();

        // ニュース順位、URL、タイトルの配列を作成
        const newsInfo = [newsRank, newsUrl, newsTitle, newsCategory];

        //ニュースリストに格納
        newsList.push(newsInfo);
    }

    // スプレッドシートに書き込み
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Yahoo');
    const range = sheet.getRange('A1:D8');
    range.setValues(newsList);
}
