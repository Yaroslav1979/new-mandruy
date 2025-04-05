<template>
    <div>
        <button class="each-ctg">                                 
                                <p class="categ-name">  <svg class="icon-ctg" id="myIcon" xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 19 21" fill="none">
  <path d="M18.8081 18.3584L12.364 7.43685C12.3553 7.39785 12.3433 7.35964 12.3282 7.32264L10.3162 3.79631L11.5549 1.5763C11.6499 1.41065 11.6749 1.21417 11.6246 1.0301C11.5742 0.846034 11.4526 0.689445 11.2864 0.594786C11.1203 0.500126 10.9232 0.475149 10.7386 0.52535C10.5539 0.575551 10.3969 0.696817 10.3019 0.862472L9.49999 2.32582L8.6909 0.898163C8.59595 0.732509 8.43888 0.611243 8.25425 0.561042C8.06962 0.510841 7.87255 0.535817 7.70639 0.630477C7.54023 0.725137 7.41859 0.881726 7.36824 1.0658C7.31788 1.24987 7.34294 1.44634 7.43788 1.61199L8.68374 3.79631L6.72903 7.30122C6.71371 7.33815 6.70173 7.37638 6.69323 7.41543L0.191869 18.3584C0.0665424 18.5749 0.000382486 18.8203 1.65346e-06 19.0701C-0.000379179 19.32 0.0650324 19.5656 0.189699 19.7824C0.314365 19.9992 0.49392 20.1795 0.710416 20.3055C0.926911 20.4314 1.17277 20.4984 1.4234 20.4999H17.5551C17.8076 20.5022 18.0561 20.4379 18.2756 20.3135C18.4951 20.1891 18.6777 20.0091 18.8049 19.7917C18.9321 19.5743 18.9994 19.3272 19 19.0755C19.0006 18.8238 18.9344 18.5764 18.8081 18.3584ZM7.13716 19.0723L9.49999 14.8321L11.8628 19.0723H7.13716ZM13.5025 19.0723L10.1301 13.0119C10.0682 12.9003 9.97739 12.8073 9.86722 12.7425C9.75704 12.6778 9.63147 12.6436 9.50357 12.6436C9.37567 12.6436 9.2501 12.6778 9.13993 12.7425C9.02975 12.8073 8.93898 12.9003 8.87706 13.0119L5.4975 19.0723H1.44489L9.49999 5.50951L17.5551 19.0723H13.5025Z" />
</svg> <em>Табір</em></p> 
                                </button>
    </div>
</template>

<script>
    export default {
        name: "CategoryLabel",
    }
</script>

<style lang="scss" scoped>
.each-ctg {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
 
 .icon-ctg {
  width: 19px;
  height: 20px; 
  fill: black; 
  /* stroke: black; */
    /* transition: fill 0.3s;  */
}

.each-ctg:hover .icon-ctg {  
  fill: white; 
  stroke: white;
}
.categ-name:hover {
  background-color: #000;
  color: white;    
}

.categ-name {
  display: flex;
  align-self: center;
  gap: 10px;
  padding: 8px 20px;
  margin: 16px 12px;
  border-radius: 100px;
  border: 2px solid #E7E6ED;
  min-width: 132px;  
  color: #000;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 14px;  
  font-weight: 500;
  line-height: 18px;  
}
</style>