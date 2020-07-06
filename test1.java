public Object getPersistentState(){
  Map<String,Object> persistentState=new HashMap<String,Object>();
  persistentState.put("assignee",this.assignee);
  persistentState.put("owner",this.owner);
  persistentState.put("name",this.name);