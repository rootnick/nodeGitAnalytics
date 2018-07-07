let Git = require("nodegit");
let authors =[];
Git.Clone("https://github.com/reduxjs/redux", "tmp");
 
Git.Repository.open("tmp").then((repo)=> {
    return repo.getMasterCommit();
  }) .then((firstCommitOnMaster)=> {
    
    let history = firstCommitOnMaster.history();
    
    history.on("commit", (commit)=> {
      let dateLine = new Date();
      dateLine.setMonth(dateLine.getMonth() - 6);

      if (commit.date()>=dateLine){//последние полгода
        
        if (commit.date().getDay()=== 0 || commit.date().getDay()===6){//суб или воскр
          authors.push(commit.author().name() );
        }
      }    
    });
    history.on("end", function(){               
      let authorsReduce = authors.reduce(function(acc,cur){
          if(!acc.hash[cur]){
            acc.hash[cur]={[cur]:1};
            acc.map.set(acc.hash[cur], 1);
            acc.result.push(acc.hash[cur]);
          }else{
            acc.hash[cur][cur] += 1;
            acc.map.set(acc.hash[cur], acc.hash[cur][cur]);
          }
          return acc;},
          {
            hash:{},
            map:new Map(),
            result:[]
      });
      let autorsResult = authorsReduce.result.sort(function(a,b){
        return authorsReduce.map.get(b)-authorsReduce.map.get(a);
      });

      console.log(autorsResult);

  });
    history.start();
  });
