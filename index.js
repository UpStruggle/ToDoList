$(function() {
    load();
    // 1、按下回车把新数据添加到本地存储里面
    $('.add input').keyup(function(e) {
        if (e.keyCode == 13) {
            // 表单为空的情况
            if ($(this).val().trim() == '') {
                $('.hint').stop().fadeIn(100, 'swing')
                $('.hint span').click(function() {
                    $(this).parent().stop().slideUp(200, 'swing')
                })
                return false
            }
            // (1)、读取原来的数据
            var local = getDate();
            // (2)、把表单里面的值 追加到数组里面
            local.push({
                title: $(this).val(),
                done: false
            });
            // (3)、重新存储到本地存储
            setDate(local)
            $(this).val('');
            // 2、本地存储数据渲染加载到页面
            load()
        }
    });
    // 读取本地存储的数据函数
    function getDate() {
        var data = localStorage.getItem('toDo');
        if (data != null) {
            // 如果data中有数据 就转换为数组对象形式的 返回给调用者
            return JSON.parse(data)
        } else {
            // 没有数据 就返回一个空的数组
            return []
        }
    };
    // 存储本地存储的数据函数
    function setDate(date) {
        localStorage.setItem('toDo', JSON.stringify(date))
    }
    // 渲染页面的函数
    function load() {
        // (1)、读取本地数据
        var data = getDate();
        // (2)、遍历这个数组 根据多少个数组元素 生成多少个小li 添加到页面中
        //  遍历之前应该清空ul里面原先渲染的数据 要不然会有重复
        $('ul').empty();
        // 统计正在进行个数和已经完成个数 的变量 在添加一条 就相应的+1 然后将加完后的值 设置给p
        var todoCount = 0;
        var doneCount = 0;
        $.each(data, function(index, element) {
            // 加个判断条件 如果数组元素的done属性为turn 就是已经完成了，往finishLis里添加li。 否侧往proceedLis添加li
            if (element.done) {
                //   checked="false" 这个得加上 要不然出不来预想的效果
                $('.finishLis').prepend(`
                    <li>
                        <input type="checkbox" class="checkbox"  checked="false"/>
                        <span class="font">${element.title}</span>
                        <i index="${index}">/
                            <span>点击删除此条记录</span>
                        </i>
                    </li>
                `)
                doneCount++;
            } else {
                $('.proceedLis').prepend(`
                    <li>
                        <input type="checkbox" class="checkbox"/>
                        <span class="font">${element.title}</span>
                        <i index="${index}">/
                            <span>点击删除此条记录</span>
                        </i>
                    </li>
                `)
                todoCount++
            }
        })
        $('.proceed p').html(todoCount)
        $('.finish p').html(doneCount)
    }
    // 3、 删除操作
    $('ul').on('click', 'i', function() {
        // 获取原来的数据
        var data = getDate();
        // 根据属性 删除数据
        data.splice($(this).attr('index'), 1);
        // 重新存储数据
        setDate(data);
        // 重新渲染页面
        load()
    });
    // 移上删除元素的时候 出来的一点小效果
    $('ul').on('mouseover', 'i', function() {
        $(this).find('span').stop().toggle(100)
    });
    $('ul').on('mouseout', 'i', function() {
        $(this).find('span').stop().toggle(100)
    });
    //4、 toDoList 正在进行和已完成选项操作
    $('ul').on('click', 'input', function() {
        // console.log($(this).prop('checked'));
        var data = getDate();
        // 根据兄弟元素的索引号 来修改done的属性 done的属性等于 当前元素的checked状态即可 在渲染页面的函数中加个判断条件 通过done属性的值往不同的标签内添加
        var index = $(this).siblings('i').attr('index');
        data[index].done = $(this).prop("checked")
            // 重新存储数据
        setDate(data);
        load()
    })
})